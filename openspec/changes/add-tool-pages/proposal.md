## Why

Web slibuje, že čtenáři ukáže, jaké nástroje pro spec-driven development existují, ale dnes je jen vyjmenuje v úvodním článku se třemi odkazy. Čtenář, který chce vědět, čím se nástroje liší a jak s nimi začít, musí obejít několik cizích webů. Nástrojů přibývá a údaje o nich (podporovaní agenti, příkazy, popularita) se rychle mění, proto potřebují vlastní stránky s jednotnou strukturou a datem ověření.

## What Changes

- Nová sekce „Nástroje pro SDD“ na úvodní stránce mezi cyklem SDD a nejnovějšími články: karty nejvýše šesti nástrojů a odkaz „Všechny nástroje →“.
- Nová stránka `/nastroje/` s přehledem všech nástrojů.
- Ke každému nástroji vlastní stránka `/nastroje/<slug>/` s blokem metadat (typ, licence, počet hvězd na GitHubu, oficiální web, repozitář, datum ověření), povinnou sekcí „Jak funguje“, která mapuje kroky nástroje na obecný cyklus SDD, a odkazy na oficiální zdroje.
- Nástroje se řadí podle popularity, měřené počtem hvězd na GitHubu k datu ověření, od nejpopulárnějšího. Nástroje bez veřejného repozitáře (komerční produkty) jsou na konci.
- První dávka šesti nástrojů: Spec Kit, OpenSpec, BMAD-METHOD, GSD Core, Agent OS, Kiro.
- Stránky nástrojů nejsou články: nezobrazují se v `/clanky/` ani mezi nejnovějšími články, ale RSS feed je obsahuje.
- Odkaz „Nástroje“ v hlavní navigaci.
- Úvodní článek odkazuje u nástrojů na jejich stránky na webu a na přehled `/nastroje/`.
- Uvolnění kontextu projektu v `openspec/config.yaml`: tón obsahu je věcný a informativní, bez zákazu porovnávání a bez pevného seznamu „první vlny“ nástrojů. Řazení podle popularity by s původním textem bylo v rozporu.

Mimo rozsah: automatické stahování počtu hvězd při buildu, srovnávací tabulka nástrojů podle funkcí, filtrování podle typu, další nástroje (Spec Workflow MCP, cc-sdd, Spec Kitty, Superpowers), hodnocení nebo vlastní testy nástrojů. Původně plánovaný Tessl první dávka nezahrnuje: podle oficiálních zdrojů se přeorientoval na správu skillů pro agenty a spec-driven development už nepopisuje. Nahradil ho GSD Core.

## Capabilities

### New Capabilities
- `tools`: Stránky nástrojů pro SDD: povinná metadata nástroje, přehled `/nastroje/`, stránka nástroje a její povinné části, řazení podle popularity, koncepty a vztah ke článkům.

### Modified Capabilities
- `homepage`: nový požadavek na sekci „Nástroje pro SDD“ s kartami nástrojů.
- `articles`: RSS feed obsahuje i stránky nástrojů. Úvodní článek odkazuje u nástrojů na jejich stránky na webu místo pouhého výčtu s cizími odkazy.
- `site-layout`: hlavní navigace obsahuje odkaz „Nástroje“.
- `seo`: titulek, meta popis a Open Graph typ `article` platí i pro stránky nástrojů.

## Impact

- Nová content collection `tools` v `src/content.config.ts` a složka `src/content/tools/` se šesti soubory MDX.
- Nový modul `src/lib/tools.ts` (filtrování konceptů a řazení na jednom místě), nové stránky `src/pages/nastroje/index.astro` a `src/pages/nastroje/[slug].astro`, nová komponenta pro karty nástrojů.
- Úpravy `src/pages/index.astro` (sekce), `src/components/Header.astro` (navigace), `src/pages/rss.xml.ts` (sloučení článků a nástrojů) a úvodního článku.
- Obsah stránek vyžaduje ověřit fakta o každém nástroji v jeho oficiální dokumentaci a počty hvězd přes GitHub API. Údaje zastarávají, datum ověření to čtenáři přizná.
- Úprava `openspec/config.yaml` (tón obsahu) a `CLAUDE.md` (neutrální tón, nová kolekce).
- Žádné nové závislosti, v prohlížeči dál neběží JavaScript.
