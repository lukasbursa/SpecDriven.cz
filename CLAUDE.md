# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

SpecDriven.cz je český rozcestník o spec-driven developmentu, statický web v Astru 7. Repozitář je veřejný a slouží zároveň jako ukázka metody, proto každá změna webu prochází OpenSpec.

## Workflow: každá změna přes OpenSpec

Cyklus je **propose → apply → archive** (`/opsx:propose`, `/opsx:apply`, `/opsx:archive`, k přemýšlení `/opsx:explore`). Kód se píše až ke schválené změně v `openspec/changes/<název>/`, nikdy mimo ni.

- `openspec/specs/` jsou zdroj pravdy o chování webu. Při implementaci ověřuj proti scénářům WHEN/THEN, ne proti vlastnímu odhadu.
- `openspec/config.yaml` obsahuje kontext projektu: publikum, **neutrální tón** obsahu (bez názorů a doporučení nástrojů), vizuální styl a stack. OpenSpec ho předává při každém generování artefaktů. Při psaní obsahu webu se jím řiď taky.
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
- **Články** jsou `.md`/`.mdx` v `src/content/articles/`. Schéma je v `src/content.config.ts` (popis ≤ 160 znaků, neplatná metadata shodí build). Slug se bere z názvu souboru. Publikované články vracej **jen** přes `getPublishedArticles()` ze `src/lib/articles.ts`: je to jediné místo, kde se filtrují koncepty (`draft: true`), a používá ho výpis, úvodní stránka, RSS i `getStaticPaths`.
- **Stavový řádek** v patičce (`StatusBar.astro` + `src/lib/openspec-status.ts`) čte při buildu přes `node:fs` z `process.cwd()` složky `openspec/specs/` a `openspec/changes/archive/`. Archivované složky musí mít název `YYYY-MM-DD-<název>`. Čísla se tedy mění až archivací a novým buildem.
- **CSS** je čisté, bez frameworku. Tokeny (barvy přes `light-dark()`, světlý „papír“ a tmavý „blueprint“) jsou v `src/styles/tokens.css`, dál `base.css` a `prose.css`. Pořadí vrstev `reset, base, prose, components` deklaruje inline `<style>` jako **první** prvek `<head>` v `BaseLayout.astro`. Bundler totiž řadí scoped styly komponent před globální CSS a vrstva `components` by jinak prohrávala. Scoped styly komponent obaluj do `@layer components { … }`.
- **Dekorativní prefixy** `##`/`###`/`####` jsou jen v CSS (`.mark-h2`, `.mark-h3`, `.prose h2/h3`, `Scenario`) jako `content: '##\00a0' / ''`. Prázdný alternativní text skryje prefix před čtečkami a nezlomitelná mezera přežije flex layout. Do textu nadpisů, titulků ani RSS `#` nepiš.
- **Mezery u odkazů:** Astro zahodí zalomení řádku mezi textem a `<a>`, takže vznikne „naGitHubu“. Mezeru před odkazem na novém řádku piš jako `{' '}` nebo ji nech na stejném řádku.
- **Fonty** IBM Plex Sans/Mono spravuje Fonts API Astra s providerem `fontsource` (`astro.config.mjs`). Build je stahuje ze sítě a servíruje z vlastní domény. Provider `npm` v Astru 7.4 nefunguje (vrací `file://` URL). Externí zdroje (Google Fonts, CDN) v HTML být nesmí, specifikace to vyžaduje.
- **Data bez času** se formátují v UTC (`src/lib/dates.ts`), aby výsledek nezávisel na časovém pásmu stroje.
- **Komponenta `Scenario.astro`** (blok WHEN/THEN) se používá na úvodní stránce i v MDX článcích (import relativní cestou). Má explicitní `aria-labelledby`, protože Chrome neodvozuje jméno `<figure>` z `<figcaption>`.
- **V prohlížeči neběží žádný JavaScript.** Barevný režim se řídí jen systémem (`prefers-color-scheme`).

## Nasazení

- **Push do `main` = nasazení na produkci.** Workflow `.github/workflows/deploy.yml` spustí `check`, `build` a nahraje `dist/` přes FTP (lftp) na Apache webhosting. Přístupové údaje jsou jen v GitHub secrets (`FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`), cíl je kořenová složka FTP účtu. Lokálně se nasadit nedá. Ruční spuštění workflow je ve výchozím stavu zkušební (`--dry-run`).
- Nahrávání má tři fáze (assety z `_astro/`, ostatní soubory, mazání), aby stránka během nasazení vždy našla své styly. Assety se porovnávají jen podle jména, protože mají hash v názvu. Složka `.well-known/` se nikdy nemaže. Důvody popisuje design změny `add-ftp-deploy`.
- **Konfigurace serveru** je v `public/.htaccess` (404 se stavem 404, HTTPS, doména bez `www`, koncové lomítko, cache). Doména je v něm napsaná natvrdo, je to třetí místo vedle `site.config.ts` a `astro.config.mjs`. Direktivy záměrně nejsou v `<IfModule>`. Lokálně jde soubor ověřit systémovým `httpd` s `AllowOverride All` nad `dist/` a požadavky s hlavičkami `Host: specdriven.cz` a `X-Forwarded-Proto: https`.

## Git

Commit zprávy se píšou česky. Commituj a pushuj, jen když o to uživatel požádá.
