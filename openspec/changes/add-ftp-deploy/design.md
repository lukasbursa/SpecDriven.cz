## Context

Web je statický výstup Astra ve složce `dist/` (viz proposal.md, Why). Hosting je Apache s podporou `.htaccess`, přístup přes nešifrované FTP jménem a heslem. Repozitář je veřejný na GitHubu, takže workflow i jeho logy uvidí kdokoli.

Omezení, která z projektu plynou:

- Build stahuje písma ze sítě (Fonts API Astra), musí tedy běžet v prostředí s přístupem k internetu. GitHub Actions to splňuje.
- Stavový řádek v patičce čte při buildu `openspec/specs/` a `openspec/changes/archive/`, build proto musí běžet nad celým checkoutem repozitáře, ne jen nad `src/`.
- Astro 7 vyžaduje Node.js 22.23.4 nebo novější.
- Adresy jsou se `trailingSlash: 'always'` a stránky vznikají jako `<cesta>/index.html`.

## Goals / Non-Goals

**Goals:**
- Celý postup nasazení na jednom místě, ve workflow souboru, který si čtenář repozitáře přečte shora dolů.
- Žádný kód třetích stran, kterému by se předávalo heslo (žádné Actions z Marketplace kromě oficiálních `actions/*`).
- Konfigurace serveru verzovaná v repozitáři a nasazovaná spolu s webem.

**Non-Goals:**
- Nasazování z počítače autora. Údaje jsou jen v GitHub secrets, lokální `.env` se nepoužívá.
- Šifrované spojení (SFTP, FTPS). Viz Risks.
- Atomické přepnutí verzí (symlinky, release složky). Přes FTP to nejde a pro malý statický web to není potřeba.
- Automatický rollback. Návrat k předchozí verzi je revert commitu a nový push.
- Komprese odpovědí, HSTS a další ladění serveru, které specifikace nepožaduje.

## Decisions

### 1. GitHub Actions: push do `main` a ruční zkušební běh

Workflow `.github/workflows/deploy.yml` má dva spouštěče:

- `push` s filtrem `branches: [main]` provede ostré nasazení,
- `workflow_dispatch` se vstupem `dry_run` (boolean, výchozí `true`) slouží ke zkušebnímu běhu. Ruční ostré nasazení jde spustit odškrtnutím volby.

Job má podmínku `if: github.ref == 'refs/heads/main'`, takže ruční spuštění nad jinou větví nic neudělá. Žádný `pull_request` ani `pull_request_target`, kód z forku se tedy nikdy nespustí se secrets. Workflow má `permissions: contents: read`.

Souběh řeší `concurrency: { group: deploy, cancel-in-progress: false }`. Druhé nasazení počká, místo aby přerušilo první uprostřed nahrávání. GitHub drží ve frontě jen poslední čekající běh, takže se při sérii pushů rovnou nasadí nejnovější commit.

Kroky: `actions/checkout` → `actions/setup-node` (Node 24 LTS, cache npm) → `npm ci` → `npm run check` → `npm run build` → kontrola secrets → `apt-get install lftp` → nahrání. Selhání kteréhokoli kroku ukončí job dřív, než se k serveru cokoli pošle.

Node 24 a ne 22: `setup-node` s `node-version: 22` vezme verzi z cache běžce, která může být starší, než Astro vyžaduje (22.23.3 neprošla). Node 24 je aktuální LTS a odpovídá lokálnímu vývoji.

*Alternativa:* oddělený job pro build a deploy s artefaktem `dist/`. Je to přehlednější v UI, ale přidává upload a download artefaktu bez reálného přínosu. Jeden job stačí.

### 2. Nahrávání přes lftp přímo ve workflow

Příkazy pro lftp jsou přímo v kroku workflow (`run:`), ne v samostatném skriptu. Skript by dával smysl pro nasazování z vlastního počítače, a to není v rozsahu.

lftp je zvolený proto, že umí `mirror -R` (rekurzivní nahrání s mazáním souborů, které lokálně chybí) a nemá na serveru žádné požadavky.

*Alternativy:* hotové Actions typu „FTP deploy“ z Marketplace (cizí kód s přístupem k heslu, některé navíc ukládají na server stavový soubor), `curl` nebo `ncftp` (neumí mazat soubory, které v buildu chybí).

### 3. Přístupové údaje v GitHub secrets

| Secret | Význam |
|---|---|
| `FTP_HOST` | adresa FTP serveru |
| `FTP_USER` | uživatel |
| `FTP_PASSWORD` | heslo |

Cílová složka se nekonfiguruje. Web se nahrává do kořenové složky FTP účtu (cesty `.` a `_astro` relativně k ní), která je na tomto hostingu zároveň kořenem webu.

Secrets se mapují přes `env:` jen do kroků, které je potřebují, ne do celého jobu. Před instalací lftp ověří krátký krok, že všechny tři jsou neprázdné, a vypíše názvy těch, které chybí. Hodnoty nevypisuje nikdy a nepoužívá `set -x`.

Heslo se lftp předává přes proměnnou `LFTP_PASSWORD` a přepínač `--env-password`, takže se neobjeví v argumentech procesu ani v příkazech lftp. GitHub navíc hodnoty secrets v logu maskuje.

Port se nekonfiguruje, používá se výchozí 21. Kdyby hosting potřeboval jiný, stačí ho zapsat do `FTP_HOST` jako `host:port`.

### 4. Nastavení FTP spojení

- `set ftp:ssl-allow no`: lftp jinak sám zkusí TLS, když ho server nabídne, a pak ověřuje certifikát. Na webhostingu, kde certifikát FTP neodpovídá jménu serveru, by nasazení náhodně padalo. Explicitní vypnutí dělá chování předvídatelné. Přechod na FTPS je pak změna tohoto nastavení.
- `set ftp:passive-mode on`: běžec GitHub Actions je za NAT, aktivní režim by nefungoval.
- `set net:max-retries` a `net:timeout` na rozumné hodnoty, aby se nasazení při výpadku spojení nezaseklo do limitu jobu (6 hodin).

### 5. Nahrávání ve třech průchodech

Aby stránky během nasazení neodkazovaly na chybějící soubory (požadavek „Web funkční během nasazení“), probíhá `mirror -R` ve třech fázích:

```
1. dist/_astro/ → _astro/           bez mazání, --ignore-time
      nové assety s novými hashi jsou na serveru, staré zůstávají
2. dist/        → ./                bez mazání, bez _astro/
      nahraje HTML, XML a ostatní soubory, stránky už odkazují na nové assety
3. dist/_astro/ → _astro/           --delete, --ignore-time
   dist/        → ./                --delete, bez _astro/
      vše je nahrané, tyto příkazy jen smažou soubory, které build nevytváří
```

Ve všech příkazech platí `--exclude-glob .well-known/` (a jeho obsah), aby mazání nesáhlo na ověřovací soubory hostingu. Dále `--no-perms`, aby soubory dostaly výchozí práva serveru, a `--parallel` pro rychlost.

Porovnávání: lftp ve výchozím stavu porovnává velikost a čas změny. V CI má každý build nové časy, takže fáze 2 nahraje vždy všechny HTML soubory. U malého webu to nevadí a je to bezpečnější než porovnávat jen velikost, kdy by se změněné HTML se stejnou délkou nenahrálo. Pro `_astro/` se čas ignoruje (`--ignore-time`), protože stejný název souboru s hashem znamená stejný obsah, a nahrávají se jen nové soubory. Proto je `_astro/` z fáze 2 a z druhého příkazu fáze 3 vyloučená. Jinak by se kvůli novým časům nahrávala při každém nasazení celá znovu.

Přepis existujícího souboru: lftp ve výchozím stavu starý soubor nejdřív smaže a pak nahraje nový, takže by na chvíli chyběl třeba `index.html`. Proto platí `set xfer:use-temp-file yes` (nahrání pod dočasným názvem a přejmenování na cílový) a `--overwrite` (bez předchozího mazání). Soubor se tak vymění najednou. Dočasné soubory po přerušeném nasazení smaže fáze 3 dalšího nasazení, protože v buildu nejsou.

Ve zkušebním režimu dostanou všechny příkazy `--dry-run`. lftp pak jen vypíše plánované nahrání a mazání.

### 6. `.htaccess` v `public/`

Soubor `public/.htaccess` Astro zkopíruje do `dist/` a nasadí se s webem. Obsah podle specifikace `hosting` a delty `site-layout`:

- `ErrorDocument 404 /404.html`. Lokální cesta (ne URL) znamená, že Apache vrátí obsah 404.html se stavem 404 bez přesměrování.
- `Options -Indexes` proti výpisu složek.
- `mod_rewrite`: jedno pravidlo pro HTTPS i `www`. Když požadavek není přes HTTPS, nebo je host `www.specdriven.cz`, přesměruje se 301 na `https://specdriven.cz%{REQUEST_URI}`. Hostingy terminují TLS různě (Apache sám, nebo proxy před ním) a hlásí HTTPS různými proměnnými. Pravidlo proto přesměruje jen tehdy, když HTTPS nehlásí žádný z ukazatelů `%{HTTPS}`, `%{ENV:HTTPS}`, `%{SERVER_PORT}` 443, `%{REQUEST_SCHEME}`, `X-Forwarded-Proto`, `X-Forwarded-Ssl` a `X-Forwarded-Port`.
- Koncové lomítko: když cesta vede na existující složku a nekončí lomítkem, následuje explicitní 301 na `https://specdriven.cz/<cesta>/`. Na `DirectorySlash` Apache se nespoléháme, protože za proxy by přesměroval na `http://` a vznikla by dvě přesměrování za sebou.
- `mod_headers`: `/_astro/*` dostane `Cache-Control: public, max-age=31536000, immutable`, soubory `.html` dostanou `Cache-Control: no-cache`.

Direktivy se **ne**obalují do `<IfModule>`. Když by hosting modul neměl, Apache vrátí chybu 500 a problém je hned vidět. S `<IfModule>` by se požadavky specifikace tiše přestaly plnit.

Doména je v `.htaccess` napsaná natvrdo. Je to třetí místo vedle `src/site.config.ts` a `astro.config.mjs`. Generovat `.htaccess` při buildu by kvůli jednomu řetězci, který se prakticky nemění, přidalo zbytečnou složitost.

### 7. Úprava kontextu projektu a dokumentace

`openspec/config.yaml`: řádek o hostingu se přepíše na Apache webhosting nasazovaný přes FTP z GitHub Actions. `CLAUDE.md` a `README.md` dostanou krátkou sekci o nasazení: kdy běží, seznam secrets a zkušební běh.

## Risks / Trade-offs

- **[Heslo jde po síti nešifrovaně]** FTP posílá jméno, heslo i obsah v čitelné podobě. Kdo má přístup k síti mezi běžcem GitHub Actions a hostingem, může heslo zachytit. → Pokud to hosting umožňuje, použít pro nasazení samostatný FTP účet omezený na složku webu, aby únik hesla neotevřel celý hosting. Když hosting později nabídne FTPS nebo SFTP, přechod je změna nastavení v kroku nahrávání (viz rozhodnutí 4).
- **[První nasazení smaže obsah cílové složky]** Průchod s `--delete` odstraní vše, co není v buildu (výchozí stránku hostingu, staré soubory). → Před prvním pushem spustit workflow ručně ve zkušebním režimu a zkontrolovat seznam mazaných souborů. Kořenová složka FTP účtu musí být kořen webu. Kdyby účet začínal v domovské složce s podsložkou webu, mazání by zasáhlo celý účet.
- **[Smyčka přesměrování za proxy]** Pokud hosting terminuje TLS na proxy a neposílá `X-Forwarded-Proto`, pravidlo pro HTTPS by přesměrovávalo pořád dokola. → Po prvním nasazení ověřit `curl -I` na HTTP i HTTPS. Pravidlo pak upravit podle toho, co hosting skutečně posílá (např. `%{ENV:HTTPS}`).
  *Nastalo při prvním nasazení:* Apache 2.4.25 na hostingu nevidí `%{HTTPS}` ani `X-Forwarded-Proto` a každá HTTPS adresa přesměrovávala sama na sebe. Pravidlo proto kontroluje všechny běžné ukazatele HTTPS (viz rozhodnutí 6). Dokud se na produkci neověří, posílá `.htaccess` navíc dočasnou diagnostickou hlavičku `X-Https-Debug` s jejich hodnotami, i u odpovědí 301. Kdyby smyčka trvala, ukáže hlavička, čím se HTTP a HTTPS na hostingu liší. Po ověření se diagnostika odstraní.
- **[Hosting nepovoluje některou direktivu v `.htaccess`]** (`Options`, `Header`) → Web vrátí 500, což se pozná hned. Direktivu pak upravit nebo zařídit povolení u hostingu.
- **[FTP server neumí přejmenovat soubor přes existující]** Výměna přes dočasný soubor spoléhá na to, že přejmenování (RNTO) přepíše cílový soubor. Linuxové FTP servery na webhostingu to běžně dělají. → Kdyby nasazení padalo na přejmenování, vypnout `xfer:use-temp-file` a smířit se s krátkým oknem při přepisu.
- **[FTP server neumí nastavit čas změny souboru]** lftp po nahrání zapisuje na server čas souboru z buildu (MFMT). Bez toho by druhý příkaz fáze 3 nahrál stránky ještě jednou. → Výsledek je stejný, jen pomalejší nasazení. Pozná se z logu.
- **[Krátké okno ve fázi 3]** Čtenář, který má otevřenou starou stránku a dočítá z ní assety přesně ve chvíli mazání, může jeden soubor nedostat. → Přijatelné, týká se jen stránek načtených před nasazením a assety bývají v cache prohlížeče.

## Migration Plan

1. Nastavit secrets `FTP_HOST`, `FTP_USER` a `FTP_PASSWORD` v GitHub repozitáři (Settings → Secrets and variables → Actions).
2. Ruční spuštění jde použít, až když je workflow ve větvi `main`, a push do `main` by zároveň spustil ostré nasazení. Workflow se proto nejdřív pushne jen se spouštěčem `workflow_dispatch`.
3. Spustit workflow ručně ve zkušebním režimu a zkontrolovat, co by se smazalo. Případně obsah kořenové složky FTP účtu zálohovat FTP klientem.
4. Doplnit spouštěč `push` a pushnout. Tím proběhne první ostré nasazení.
5. Po ostrém nasazení ověřit scénáře ze specifikací `hosting` a `site-layout` (HTTP stavy, přesměrování, hlavičky) přes `curl -I`.
6. Rollback: `git revert` problematického commitu a push do `main`. Při problému s `.htaccess` lze soubor na serveru dočasně smazat nebo přejmenovat přes FTP klienta.
