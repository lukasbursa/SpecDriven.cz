## 1. Řazení archivovaných změn

- [x] 1.1 Upravit `readOpenSpecStatus()` v `src/lib/openspec-status.ts` podle design.md (datum z názvu, nejstarší čas přidání v gitu, název). Ověřit, že na současném repozitáři vrací pořadí `add-community-links`, `add-tool-pages`, `add-ftp-deploy`, `add-site-foundation` a že stavový řádek v `dist/index.html` ukazuje „poslední: add-community-links · 27. 10. 2026“.
- [x] 1.2 Ověřit scénář „Archivace před commitem“: dočasně vytvořit necommitnutou složku `openspec/changes/archive/2026-10-27-aaa-test/` (název záměrně první v abecedě), sestavit web a zkontrolovat, že stavový řádek ukazuje `aaa-test`. Složku smazat.
- [x] 1.3 Ověřit náhradní chování: zavolat `readOpenSpecStatus()` nad kopií složky `openspec/` mimo git repozitář a nad mělkým klonem (`git clone --depth 1`). V obou případech funkce nesmí vyhodit chybu, má vypsat varování a vrátit stejný počet změn.

## 2. Nasazení a dokumentace

- [x] 2.1 Doplnit `fetch-depth: 0` k `actions/checkout@v5` v `.github/workflows/deploy.yml` s komentářem proč. Ověřit, že soubor je platný YAML a že se ostatní kroky nezměnily (`git diff`).
- [x] 2.2 Upravit poznámku o stavovém řádku v `CLAUDE.md` (pořadí z gitu, varování bez historie, `fetch-depth: 0`). Ověřit, že `npm run check` a `npm run build` projdou a `openspec validate fix-latest-archived-change --strict` je bez chyb.

## 3. Po nasazení (ručně, po pushi do main)

- [ ] 3.1 Ověřit v logu kroku „npm run build“ v GitHub Actions, že build nevypsal varování o historii, a na produkci, že stavový řádek ukazuje jako poslední změnu tu, která byla archivována naposledy.
