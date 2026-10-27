## Why

Čtenář dnes nemá kde se zeptat, doplnit zkušenost ani upozornit na chybu. Repozitář je sice veřejný, ale web na něj odkazuje jen jako na zdrojový kód. Údaje o nástrojích se rychle mění a datum ověření čtenáři přizná, že můžou být zastaralé. Kdo si zastaralého údaje všimne, ho ale dnes nemá jak nahlásit. Repozitář slouží jako ukázka metody, takže příspěvky zvenku zároveň ukazují, jak se do projektu vedeného přes specifikace přispívá.

## What Changes

- Patička každé stránky odkazuje na diskuze v repozitáři webu na GitHubu (GitHub Discussions).
- Na konci každého článku a každé stránky nástroje je blok „Zpětná vazba“ s odkazem na diskuzi a s odkazem „Navrhnout úpravu“, který otevře zdrojový soubor stránky v editoru na GitHubu.
- Stránka nástroje má v bloku navíc odkaz „Nahlásit zastaralý údaj“. Otevře na GitHubu formulář nového issue s předvyplněným nástrojem a adresou stránky.
- Články i nástroje dostanou volitelné metadatum s odkazem na vlastní vlákno v diskuzích. Když chybí, odkaz vede na kategorii diskuzí pro články, resp. pro nástroje.
- Nové pravidlo pro příspěvky: oprava textu a faktů v existujícím obsahu smí přijít přímým pull requestem bez změny v OpenSpec. Nový článek, nový nástroj a cokoli, co mění chování nebo vzhled webu, prochází cyklem propose → apply → archive. Pravidlo popíše stránka „Jak vznikl tento web“, `CONTRIBUTING.md` a `CLAUDE.md`.
- Šablony issue v repozitáři: „Zastaralý údaj o nástroji“ (s povinným odkazem na oficiální zdroj) a „Návrh článku nebo nástroje“.
- Web dál nic nevkládá ze serverů třetích stran. Diskuze i formuláře jsou jen odkazy na GitHub.

Mimo rozsah: diskuze vložená do stránky (Giscus, Disqus a podobné), předvyplněné zakládání nových vláken v diskuzích, automatická kontrola pull requestů z forků, výpis přispěvatelů a hostující autoři, sjednocení `rel="noopener"` u oficiálních odkazů na stránkách nástrojů.

Pořadí: změna navazuje na archivovanou `add-tool-pages` (capability `tools`). Před nasazením musí autor webu na GitHubu zapnout Discussions a založit kategorie, jinak by odkazy vedly na 404.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `open-development`: odkaz na diskuze v patičce. Stránka „Jak vznikl tento web“ popisuje, jak do webu přispět.
- `articles`: volitelné metadatum s odkazem na vlákno v diskuzích, blok „Zpětná vazba“ na konci článku.
- `tools`: volitelné metadatum s odkazem na vlákno v diskuzích, blok „Zpětná vazba“ na konci stránky nástroje včetně nahlášení zastaralého údaje.

## Impact

- `src/site.config.ts`: adresa diskuzí a jejich kategorií, funkce pro odkaz na editaci souboru a pro odkaz na nové issue.
- `src/content.config.ts`: pole `discussion` v kolekcích `articles` a `tools`.
- Nová komponenta pro blok zpětné vazby, úpravy `src/components/Footer.astro`, `src/pages/clanky/[slug].astro`, `src/pages/nastroje/[slug].astro` a `src/pages/jak-vznikl-tento-web.astro`.
- Nové soubory `.github/ISSUE_TEMPLATE/zastaraly-udaj.yml`, `.github/ISSUE_TEMPLATE/navrh-obsahu.yml`, `.github/ISSUE_TEMPLATE/config.yml` a `CONTRIBUTING.md`, úprava `CLAUDE.md`.
- Nastavení repozitáře na GitHubu (Discussions a kategorie) udělá autor ručně, z repozitáře se nastavit nedá.
- Žádné nové závislosti. Na stránkách nepřibude JavaScript ani načítání z cizích domén.
