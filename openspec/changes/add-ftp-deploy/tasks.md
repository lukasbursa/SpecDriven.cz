## 1. Konfigurace serveru

- [x] 1.1 Vytvořit `public/.htaccess` (ErrorDocument 404, `Options -Indexes`, přesměrování na HTTPS a doménu bez `www`, explicitní přesměrování na koncové lomítko, cache hlavičky pro `/_astro/` a `.html`, bez `<IfModule>`) a ověřit po `npm run build`, že `dist/.htaccess` existuje se stejným obsahem
- [x] 1.2 Ověřit `.htaccess` v lokálním Apache (např. kontejner `httpd` s `AllowOverride All` a moduly rewrite a headers) nad `dist/`: `curl -I` vrací 404 se stavem 404 pro neexistující adresu, 301 pro `/clanky` → `/clanky/`, `immutable` pro soubor z `/_astro/`, `no-cache` pro HTML a žádný výpis složky `/_astro/`

## 2. Workflow nasazení

- [x] 2.1 Vytvořit `.github/workflows/deploy.yml` zatím jen se spouštěčem `workflow_dispatch` (vstup `dry_run`, výchozí `true`), s podmínkou na větev `main`, `permissions: contents: read`, `concurrency` bez rušení a kroky Node 24, `npm ci`, `npm run check`, `npm run build` a ověřit, že workflow neobsahuje `pull_request` a hodnoty přístupových údajů v něm nejsou
- [x] 2.2 Doplnit krok kontroly secrets (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`), který vypíše jen názvy chybějících, a ověřit tutéž logiku lokálně spuštěním kroku v shellu bez proměnných: skončí chybou s názvy a nic nepřipojuje
- [x] 2.3 Doplnit instalaci lftp a krok nahrávání podle design.md (heslo přes `LFTP_PASSWORD` + `--env-password`, `ftp:ssl-allow no`, pasivní režim, timeouty, tři fáze `mirror -R`, vyloučení `.well-known/`, `--no-perms`, `--dry-run` podle vstupu) a ověřit, že secrets jsou v `env:` jen u kroků, které je potřebují

## 3. Kontext a dokumentace

- [x] 3.1 Upravit v `openspec/config.yaml` řádek o hostingu na Apache webhosting nasazovaný přes FTP z GitHub Actions a ověřit `openspec instructions proposal --change add-ftp-deploy --json`, že nový text je v poli `context`
- [x] 3.2 Doplnit do `CLAUDE.md` a `README.md` sekci o nasazení (kdy běží, seznam secrets, zkušební běh) a ověřit, že `npm run check` a `npm run build` stále projdou

## 4. První nasazení a ověření

- [x] 4.1 Nastavit v GitHub repozitáři secrets `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` a ověřit, že jsou vidět v Settings → Secrets and variables → Actions
- [ ] 4.2 Pushnout workflow (jen s `workflow_dispatch`) do `main`, spustit ho ručně ve zkušebním režimu a ověřit v logu seznam souborů k nahrání a smazání, nezměněný obsah hostingu, kořenovou složku FTP účtu jako kořen webu (v seznamu jsou soubory webu, ne podsložky účtu) a log bez hesla
- [x] 4.3 Doplnit do workflow spouštěč `push` na `main`, pushnout a ověřit v záložce Actions, že ostré nasazení proběhlo a log neobsahuje heslo
- [ ] 4.4 Ověřit na produkci přes `curl -I` scénáře ze specifikací `hosting` a `site-layout`: HTTP → HTTPS (301), `www` → bez `www` (301), `/clanky` → `/clanky/` (301), `/neexistuje/` → 404 s českou stránkou, hlavičky cache, žádný výpis `/_astro/`
- [x] 4.5 Ověřit scénář „Kontrola před nahráním“: na pomocné větvi rozbít metadata článku, ověřit lokálně, že `npm run build` selže, a potvrdit, že ve workflow je build před nahráváním a žádný krok nemá `continue-on-error`
