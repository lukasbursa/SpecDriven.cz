# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

SpecDriven.cz je český rozcestník o spec-driven developmentu, statický web v Astru 7. Repozitář je veřejný a slouží zároveň jako ukázka metody, proto každá změna webu prochází OpenSpec.

## Workflow: každá změna přes OpenSpec

Cyklus je **propose → apply → archive** (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`, k přemýšlení `/opsx:explore`). Kód se píše až ke schválené změně v `openspec/changes/<název>/`, nikdy mimo ni.

Jediná výjimka: úprava textu a faktů v **existujícím** souboru v `src/content/` (překlep, formulace, zastaralý údaj s odkazem na oficiální zdroj a nové `verifiedDate`) smí jít přímým commitem nebo pull requestem bez změny v OpenSpec. Nový článek nebo nástroj a cokoli mimo `src/content/` (komponenty, stránky, styly, schéma, konfigurace) prochází cyklem. Pravidlo platí pro všechny a popisují ho i `CONTRIBUTING.md` a stránka „Jak vznikl tento web“, drž je v souladu.

- `openspec/specs/` jsou zdroj pravdy o chování webu. Při implementaci ověřuj proti scénářům WHEN/THEN, ne proti vlastnímu odhadu.
- `openspec/config.yaml` obsahuje kontext projektu: publikum, **věcný tón** obsahu (fakta o nástrojích s odkazem na oficiální zdroje a datem ověření), vizuální styl a stack. Výjimkou z věcného tónu jsou názorové články se štítkem `názor`: ostřejší formulace smí mít v nadpisu, perexu a závěru, fakta v nich mají zdroj. OpenSpec ho předává při každém generování artefaktů. Při psaní obsahu webu se jím řiď taky.
- Artefakty se píšou česky. Strukturní nadpisy (`### Requirement:`, `#### Scenario:`) a klíčová slova SHALL/MUST zůstávají anglicky.
- Když implementace odhalí rozpor se specifikací, uprav nejdřív artefakty změny (design.md, specs) a teprve potom kód.
- Kontrola artefaktů: `openspec validate <změna> --strict`, pro hlavní specifikace `openspec validate --specs --strict`.

## Příkazy

```sh
npm run dev       # vývojový server, http://localhost:4321
npm run build     # statický web do dist/ (potřebuje síť, viz Fonty)
npm run check     # astro check – typy a diagnostika .astro souborů
npm run preview   # náhled sestaveného dist/
```

Testovací framework projekt nemá. Úkol je ověřený, když projde `npm run check` a `npm run build` a výstup v `dist/` (nebo v prohlížeči) splňuje scénáře ze specifikace.

## Architektura a záludnosti

- **Konfigurace** je na jednom místě, v `src/site.config.ts` (doména, autor, URL repozitáře, `repoTreeUrl()` pro odkazy do složek). Komponenty si hodnoty berou odtud.
- **Odkazy na GitHub** (diskuze, editace souboru, nové issue) skládá jen `src/site.config.ts`: `discussions` (URL a kategorie), `repoEditUrl()` a `newIssueUrl()`. Slugy kategorií mají diakritiku (`články`, `nástroje`). GitHub vrací 200 i pro neexistující kategorii, existenci ověř podle popisu kategorie na stránce. Sekci „Zpětná vazba“ (`Feedback.astro`) má na konci stránka článku i nástroje. Volitelné pole `discussion` v obou kolekcích přepíše odkaz na kategorii a schéma ho pustí jen do diskuzí repozitáře webu. `newIssueUrl()` předvyplňuje pole formulářů v `.github/ISSUE_TEMPLATE/` podle jejich `id`, při přejmenování `id` uprav i volání. Web diskuze nevkládá, jen na ně odkazuje: požadavek na žádné načítání z cizích domén platí dál.
- **Články** jsou `.md`/`.mdx` v `src/content/articles/`. Schéma je v `src/content.config.ts` (popis ≤ 160 znaků, neplatná metadata shodí build). Slug se bere z názvu souboru. Publikované články vracej **jen** přes `getPublishedArticles()` ze `src/lib/articles.ts`: je to jediné místo, kde se filtrují koncepty (`draft: true`), a používá ho výpis, úvodní stránka, RSS i `getStaticPaths`.
- **Nástroje** jsou samostatná kolekce `tools` v `src/content/tools/` se stránkami na `/nastroje/<slug>/`. Nejsou to články: nepatří do `/clanky/` ani mezi nejnovější, sdílí s nimi jen RSS. Vracej je **jen** přes `getPublishedTools()` ze `src/lib/tools.ts`, která filtruje koncepty a řadí podle `stars` (ručně zapsané hvězdy na GitHubu k `verifiedDate`, nástroje bez hvězd na konci). Schéma vyžaduje `website` nebo `repository` a `stars` jen s `repository`. Stránka nástroje shodí build, když obsah nemá nadpis `## Jak funguje`. Sekci „Oficiální odkazy“ generuje šablona z metadat, do obsahu se nepíše.
- **Srovnání nástrojů** je článek `src/content/articles/srovnani-nastroju.mdx` s tabulkami `ComparisonTable.astro`. Řádky jsou vždy publikované nástroje z `getPublishedTools()`. Typ, licence, hvězdy a datum ověření bere komponenta z metadat, ostatní sloupce mají hodnoty podle slugu a v nich se jen text v `` `…` `` vypíše jako `<code>`. Build selže, když ve sloupci chybí hodnota pro publikovaný nástroj nebo je v něm neznámý slug. Koncepty se nehlídají ani nevypisují. **Přidání nástroje nebo změna údajů o něm proto zahrnuje i doplnění srovnání**, ve stejné změně OpenSpec. Na srovnání odkazuje přehled `/nastroje/` i šablona stránky nástroje přes `getComparisonArticle()`. Když je článek koncept, odkazy zmizí. Stránka článku má `container-type: inline-size`, aby tabulka (`width: 100cqi`) mohla přesáhnout sloupec textu.
- **Metadata pro vyhledávače** vypisuje `SeoHead.astro`. Strukturovaná data (JSON-LD) skládají funkce ze `src/lib/structured-data.ts` a stránka je předá v propu `structuredData`. `<script type="application/ld+json" is:inline>` jsou data, prohlížeč je nespouští, takže pravidlu o JavaScriptu neodporují. Datum poslední změny počítají `articleModifiedDate()` a `toolModifiedDate()`, u nástroje včetně `verifiedDate`, protože nové ověření mění údaje na stránce. Web má jednoho autora: `site.author` a `site.authorProfiles`.
- **`lastmod` v sitemapě** čte integrace ze `src/lib/sitemap-lastmod.ts` až z vygenerovaných stránek (`article:modified_time`, jinak `article:published_time`). V `astro.config.mjs` musí být před sitemap. Integrace sitemap totiž výjimku ze `serialize()` jen zaloguje a build projde bez sitemapy. Stránka článku nebo nástroje bez těchto metadat shodí build, pozor proto na změny jejich výpisu v `SeoHead`.
- **Blok metadat** ve stylu YAML (`Frontmatter.astro`) sdílí stránka článku i nástroje. Pravidla rodiče pro přímé potomky piš jako `& > :global(*)`, scoped selektor by kořen vnořené komponenty minul.
- **Stavový řádek** v patičce (`StatusBar.astro` + `src/lib/openspec-status.ts`) čte při buildu přes `node:fs` z `process.cwd()` složky `openspec/specs/` a `openspec/changes/archive/`. Archivované složky musí mít název `YYYY-MM-DD-<název>`. Čísla se tedy mění až archivací a novým buildem. Při stejném datu rozhoduje o poslední změně čas commitu, který složku do archivu přidal (`git log` omezený na archiv vidí přesun jako přidání), necommitnutá složka je nejnovější. Bez gitu nebo v mělkém klonu build vypíše varování a řadí podle názvu, proto má checkout v `deploy.yml` `fetch-depth: 0`.
- **Úryvek specifikace** v úvodní sekci (`SpecExcerpt.astro` + `src/lib/spec-excerpt.ts`) čte při buildu z `openspec/specs/homepage/spec.md` požadavek „Vysvětlení SDD na první pohled“ až po další nadpis `##`/`###` a ukazuje ho jako zdrojový Markdown s čísly řádků. Přejmenování nebo smazání požadavku shodí build, název je napsaný v `src/pages/index.astro`. Delší znění požadavku zvětší úvodní sekci, po úpravě ji zkontroluj na 1280×800.
- **CSS** je čisté, bez frameworku. Tokeny (barvy přes `light-dark()`, světlý „papír“ a tmavý „blueprint“) jsou v `src/styles/tokens.css`, dál `base.css` a `prose.css`. Pořadí vrstev `reset, base, prose, components` deklaruje inline `<style>` jako **první** prvek `<head>` v `BaseLayout.astro`. Bundler totiž řadí scoped styly komponent před globální CSS a vrstva `components` by jinak prohrávala. Scoped styly komponent obaluj do `@layer components { … }`.
- **Dekorativní prefixy** `##`/`###`/`####` jsou jen v CSS (`.mark-h2`, `.mark-h3`, `.prose h2/h3`, `Scenario`) jako `content: '##\00a0' / ''`. Prázdný alternativní text skryje prefix před čtečkami a nezlomitelná mezera přežije flex layout. Do textu nadpisů, titulků ani RSS `#` nepiš.
- **Mezery u odkazů:** Astro zahodí zalomení řádku mezi textem a `<a>`, takže vznikne „naGitHubu“. Mezeru před odkazem na novém řádku piš jako `{' '}` nebo ji nech na stejném řádku.
- **Fonty** IBM Plex Sans/Mono spravuje Fonts API Astra s providerem `fontsource` (`astro.config.mjs`). Build je stahuje ze sítě a servíruje z vlastní domény. Provider `npm` v Astru 7.4 nefunguje (vrací `file://` URL). Externí zdroje (Google Fonts, CDN) v HTML být nesmí, specifikace to vyžaduje.
- **Data bez času** se formátují v UTC (`src/lib/dates.ts`), aby výsledek nezávisel na časovém pásmu stroje.
- **Komponenta `Scenario.astro`** (blok WHEN/THEN) se používá na úvodní stránce i v MDX článcích (import relativní cestou). Má explicitní `aria-labelledby`, protože Chrome neodvozuje jméno `<figure>` z `<figcaption>`.
- **Barevný režim** se ve výchozím stavu řídí systémem. Přepínač v hlavičce (`Header.astro`) ukládá ruční volbu do `localStorage` pod klíčem `color-scheme`, jen když se liší od systému, a nastaví atribut `data-theme` na `<html>`. Ten v `tokens.css` přepne `color-scheme`, a tím všechny barvy z `light-dark()`. Uloženou volbu před vykreslením uplatní inline skript (`is:inline`) v `<head>` v `BaseLayout.astro`. Nesmí být modulem, ten se spouští až po načtení stránky a stránka by blikla. Bez JavaScriptu zůstane tlačítko `hidden`. Jinak web JavaScript nepoužívá, nový skript má mít stejně jasný důvod.

## Nasazení

- **Push do `main` = nasazení na produkci.** Workflow `.github/workflows/deploy.yml` spustí `check`, `build` a nahraje `dist/` přes FTP (lftp) na Apache webhosting. Přístupové údaje jsou jen v GitHub secrets (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`), cíl je kořenová složka FTP účtu. Lokálně se nasadit nedá. Ruční spuštění workflow je ve výchozím stavu zkušební (`--dry-run`).
- Nahrávání má tři fáze (assety z `_astro/`, ostatní soubory, mazání), aby stránka během nasazení vždy našla své styly. Assety se porovnávají jen podle jména, protože mají hash v názvu. Složka `.well-known/` se nikdy nemaže. Důvody popisuje design změny `add-ftp-deploy`.
- **Konfigurace serveru** je v `public/.htaccess` (404 se stavem 404, doména bez `www`, adresy s `index.html`, koncové lomítko, cache). Přesměrování z HTTP na HTTPS tam záměrně není: proxy hostingu Apachi nepředává, jestli požadavek přišel přes HTTPS, a každé takové pravidlo skončí smyčkou (podrobnosti v designu `add-ftp-deploy`). Doména je v něm napsaná natvrdo, je to třetí místo vedle `site.config.ts` a `astro.config.mjs`. Direktivy záměrně nejsou v `<IfModule>`. Lokálně jde soubor ověřit systémovým `httpd` s `AllowOverride All` nad `dist/` a požadavky s hlavičkou `Host: specdriven.cz`.

## Git

Commit zprávy se píšou česky. Commituj a pushuj, jen když o to uživatel požádá.
