## 1. Základ projektu

- [ ] 1.1 Založit Astro projekt s TypeScriptem (strict) v kořeni repozitáře a ověřit, že `npm run dev` i `npm run build` proběhnou bez chyby
- [ ] 1.2 Přidat integrace `@astrojs/mdx`, `@astrojs/sitemap` a `@astrojs/rss`, nastavit `site: 'https://specdriven.cz'` a `trailingSlash: 'always'` a ověřit úspěšný build
- [ ] 1.3 Vytvořit `src/site.config.ts` (název, podtitul, autor, doména, URL repozitáře, URL OpenSpec) a ověřit kontrolou `npx astro check` bez chyb
- [ ] 1.4 Přidat `.gitignore` (node_modules, dist, .astro) a `README.md` s popisem projektu a odkazem na `openspec/` a ověřit, že `git status` neukazuje build artefakty

## 2. Layout a styly

- [ ] 2.1 Vytvořit globální stylesheet s barevnými tokeny pro světlý a tmavý režim a systémovým fontem a ověřit kontrast textu ≥ 4,5 : 1 v obou režimech
- [ ] 2.2 Vytvořit `BaseLayout` s `lang="cs"`, odkazem „Přeskočit na obsah“, hlavičkou, `<main>` a patičkou a ověřit, že první Tab zaměří odkaz „Přeskočit na obsah“
- [ ] 2.3 Vytvořit hlavičku s názvem webu a navigací (Články, Jak vznikl tento web) se zvýrazněním aktuální sekce přes `aria-current` a ověřit to na detailu článku
- [ ] 2.4 Vytvořit patičku se jménem autora, rokem, textem „Tento web byl vytvořen pomocí SDD – OpenSpec“ (s odkazy na článek o SDD a na OpenSpec) a odkazem na repozitář s `rel="noopener"` a ověřit ji ve vygenerovaném HTML
- [ ] 2.5 Vytvořit stránku 404 s odkazy na úvodní stránku a seznam článků a ověřit, že build vytvoří `dist/404.html`
- [ ] 2.6 Ověřit, že na šířce 320 px žádná stránka nemá vodorovné posouvání

## 3. SEO

- [ ] 3.1 Vytvořit komponentu `SeoHead` (title ve tvaru „… | SpecDriven.cz“, meta description, canonical, Open Graph s `og:locale` `cs_CZ`, odkaz na RSS) a ověřit její výstup na úvodní stránce a na článku
- [ ] 3.2 Přidat `public/og-default.png` (1200×630) a ověřit, že `og:image` obsahuje absolutní URL
- [ ] 3.3 Přidat `public/robots.txt` s odkazem na sitemap, vyloučit 404 ze sitemap a ověřit obsah `dist/robots.txt` a `dist/sitemap-index.xml`

## 4. Články

- [ ] 4.1 Definovat content collection `articles` se schématem (title, description ≤ 160, pubDate, updatedDate?, tags[], draft) a ověřit, že článek bez popisu shodí build s chybou uvádějící soubor
- [ ] 4.2 Vytvořit `getPublishedArticles()` (filtruje koncepty, řadí od nejnovějšího) a utilitu pro české formátování data a ověřit výstup „26. října 2026“
- [ ] 4.3 Vytvořit stránku `/clanky/` se seznamem článků a ověřit pořadí a zobrazená pole
- [ ] 4.4 Vytvořit stránku `/clanky/[slug]/` s datem publikace, případným „Aktualizováno“ a štítky a ověřit, že pro koncept se stránka v buildu nevygeneruje
- [ ] 4.5 Vytvořit `/rss.xml` z publikovaných článků a ověřit, že výstup je platný RSS 2.0 s absolutními odkazy
- [ ] 4.6 Napsat úvodní článek `co-je-spec-driven-development.md` (princip SDD, cyklus návrh → specifikace → implementace → archivace, přínos pro práci s AI) a ověřit, že je dostupný na `/clanky/co-je-spec-driven-development/`

## 5. Stránky

- [ ] 5.1 Vytvořit úvodní stránku s hlavním nadpisem, úvodním textem (max. 3 věty), výzvou k úvodnímu článku a pěti nejnovějšími články a ověřit, že se koncepty nezobrazují
- [ ] 5.2 Vytvořit stránku `/jak-vznikl-tento-web/` s popisem cyklu propose → apply → archive a odkazy na `openspec/specs/` a `openspec/changes/archive/` v repozitáři a ověřit odkazy

## 6. Závěrečné ověření

- [ ] 6.1 Spustit `npx astro check` a `npm run build` bez chyb a varování
- [ ] 6.2 Projít web lokálně (`npm run preview`) proti všem scénářům ve specs této změny a ověřit, že jsou splněné
