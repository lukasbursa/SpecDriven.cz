## Why

Web se zatím nikam nenasazuje: po každé změně by se musel ručně sestavit a nahrát na hosting. Hosting webu je klasický webhosting s Apache, kam se nahrává přes FTP. Ruční nahrávání je pomalé a snadno se zapomene. Stavový řádek v patičce se navíc mění až archivací změny a novým buildem, takže by veřejná verze webu zaostávala za repozitářem.

Chceme, aby se web nasadil sám po každém pushi do větve `main` a aby server vracel stránky se správnými HTTP stavy a přesměrováními, které dnes zajišťuje jen statický hosting typu Cloudflare Pages.

## What Changes

- Automatické nasazení přes GitHub Actions: po každém pushi do `main` se web zkontroluje (`npm run check`), sestaví (`npm run build`) a obsah `dist/` se nahraje přes FTP na hosting. Když kontrola nebo build selže, nic se nenahraje.
- Nahrávání smaže ze serveru soubory, které nový build už nevytváří (např. staré CSS s jiným hashem). Pořadí nahrávání zajistí, že web během nasazení nezobrazí stránky bez stylů.
- Přístupové údaje k FTP jsou uložené jen v GitHub secrets. V repozitáři žádné nejsou.
- Ruční spuštění workflow z GitHubu se zkušebním režimem, který jen vypíše, co by se nahrálo a smazalo. Hodí se hlavně před prvním nasazením.
- Nový soubor `.htaccess` pro Apache: vlastní stránka 404 se stavem 404, přesměrování na doménu bez `www` a na adresy s koncovým lomítkem, dlouhá cache pro soubory s hashem v názvu.
- Oprava kontextu projektu v `openspec/config.yaml`: hosting je Apache webhosting nasazovaný přes FTP, ne Cloudflare Pages / Vercel / Netlify.

Mimo rozsah: přesměrování z HTTP na HTTPS (z `.htaccess` na tomto hostingu nejde, viz design.md), zmínka o nasazení na webu (stránka „Jak vznikl tento web“ se nemění), nasazování z vlastního počítače, šifrované spojení (SFTP, FTPS), náhledová nasazení pro pull requesty.

## Capabilities

### New Capabilities
- `deployment`: Automatické nasazení webu na hosting po pushi do `main`: podmínky spuštění, kontrola před nahráním, nahrání přes FTP, mazání zastaralých souborů, zkušební režim a zacházení s přístupovými údaji.
- `hosting`: Chování webového serveru: přesměrování na kanonickou doménu a adresy s lomítkem, cache hlavičky a výchozí nastavení Apache, které web potřebuje.

### Modified Capabilities
- `site-layout`: Požadavek „Stránka 404“ se zpřesňuje, server MUST pro neexistující adresu vrátit HTTP stav 404 (ne 200 ani přesměrování). Na statickém hostingu to platilo samo, na Apache to musí zajistit konfigurace.

## Impact

- Nový workflow `.github/workflows/deploy.yml`, který obsahuje i samotný postup nahrávání.
- Nový soubor `public/.htaccess`, který Astro zkopíruje do `dist/`.
- V GitHub repozitáři je potřeba nastavit secrets s údaji k FTP (server, uživatel, heslo). Web se nahrává do kořenové složky FTP účtu, která je zároveň kořenem webu.
- Nástroj `lftp` v běhovém prostředí GitHub Actions (instaluje se v rámci workflow).
- Úprava `openspec/config.yaml` (hosting) a dokumentace pro vývojáře (`CLAUDE.md`, `README.md`).
- Repozitář je veřejný: workflow uvidí každý, proto se nasazení nikdy nespouští z pull requestů a hodnoty secrets se nesmí objevit v logu. FTP přenáší heslo nešifrovaně, riziko popisuje design.md.
