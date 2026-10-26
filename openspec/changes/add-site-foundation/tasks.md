## 1. Základ projektu

- [x] 1.1 Založit Astro 7 projekt s TypeScriptem (strict) v kořeni repozitáře a ověřit, že `npm run dev` i `npm run build` proběhnou bez chyby
- [x] 1.2 Přidat integrace `@astrojs/mdx`, `@astrojs/sitemap` a `@astrojs/rss`, nastavit `site: 'https://specdriven.cz'` a `trailingSlash: 'always'` a ověřit úspěšný build
- [x] 1.3 Vytvořit `src/site.config.ts` (název, podtitul, autor, doména, URL repozitáře a větev, URL OpenSpec) a ověřit kontrolou `npx astro check` bez chyb
- [x] 1.4 Přidat `.gitignore` (node_modules, dist, .astro) a `README.md` s popisem projektu a odkazem na `openspec/` a ověřit, že `git status` neukazuje build artefakty

## 2. Vizuální základ

- [x] 2.1 Přidat IBM Plex Sans a Mono hostované u nás (jen `latin` + `latin-ext`, řezy dle design.md) a ověřit v síťovém panelu prohlížeče, že stránka nestahuje nic z cizí domény a věta „Příliš žluťoučký kůň úpěl ďábelské ódy“ se zobrazí bez náhradního fontu
- [x] 2.2 Vytvořit `src/styles/tokens.css` s barvami papír/blueprint přes `color-scheme` a `light-dark()` (se světlou zálohou) a ověřit kontrast textu ≥ 4,5 : 1 v obou režimech
- [x] 2.3 Vytvořit `src/styles/base.css` (reset, typografie, odkazy, viditelný focus) a `src/styles/prose.css` (nadpisy s dekorativními prefixy, seznamy, kód) v `@layer` a ověřit, že čtečka obrazovky nepředčítá prefixy `##`
- [x] 2.4 Nastavit Shiki s tématem `css-variables` napojeným na tokeny a ověřit, že blok kódu je čitelný ve světlém i tmavém režimu
- [x] 2.5 Vytvořit komponentu `Scenario.astro` (nadpis scénáře, řádky WHEN/THEN, dekorativní `####`) a ověřit její zobrazení i přečtení čtečkou

## 3. Layout

- [x] 3.1 Vytvořit `BaseLayout` s `lang="cs"`, odkazem „Přeskočit na obsah“, hlavičkou, `<main>` a patičkou a ověřit, že první Tab zaměří odkaz „Přeskočit na obsah“
- [x] 3.2 Vytvořit hlavičku s wordmarkem a navigací (Články, Jak vznikl tento web) se zvýrazněním aktuální sekce přes `aria-current` a ověřit to na detailu článku
- [x] 3.3 Vytvořit utilitu `getOpenSpecStatus()` (počet specs, počet archivovaných změn, poslední změna z názvu složky) a ověřit ji na stavu bez archivu (0, bez poslední změny) i s testovací archivovanou složkou
- [x] 3.4 Vytvořit komponentu `StatusBar.astro` a patičku se jménem autora, rokem, textem „Tento web byl vytvořen pomocí SDD – OpenSpec“ (odkazy na článek o SDD a na OpenSpec), odkazem na repozitář s `rel="noopener"` a stavovým řádkem a ověřit ji ve vygenerovaném HTML
- [x] 3.5 Vytvořit stránku 404 s odkazy na úvodní stránku a seznam článků a ověřit, že build vytvoří `dist/404.html`

## 4. SEO

- [x] 4.1 Vytvořit komponentu `SeoHead` (title ve tvaru „… | SpecDriven.cz“ bez znaků `#`, meta description, canonical, Open Graph s `og:locale` `cs_CZ`, odkaz na RSS) a ověřit její výstup na úvodní stránce a na článku
- [x] 4.2 Přidat `public/og-default.png` (1200×630) ve vizuálním stylu webu a ověřit, že `og:image` obsahuje absolutní URL
- [x] 4.3 Přidat `public/robots.txt` s odkazem na sitemap, vyloučit 404 ze sitemap a ověřit obsah `dist/robots.txt` a `dist/sitemap-index.xml`

## 5. Články

- [x] 5.1 Definovat content collection `articles` se schématem (title, description ≤ 160, pubDate, updatedDate?, tags[], draft) a ověřit, že článek bez popisu shodí build s chybou uvádějící soubor
- [x] 5.2 Vytvořit `getPublishedArticles()` (filtruje koncepty, řadí od nejnovějšího) a utilitu pro české formátování data (dlouhý i krátký tvar) a ověřit výstupy „26. října 2026“ a „26. 10. 2026“
- [x] 5.3 Vytvořit stránku `/clanky/` se seznamem článků (nadpisy s dekorativním `###`, datum, popis, štítky) a ověřit pořadí a zobrazená pole
- [x] 5.4 Vytvořit stránku `/clanky/[slug]/` s blokem metadat ve stylu frontmatteru, případným „Aktualizováno“ a štítky a ověřit, že pro koncept se stránka v buildu nevygeneruje
- [x] 5.5 Vytvořit `/rss.xml` z publikovaných článků a ověřit, že výstup je platný RSS 2.0 s absolutními odkazy a bez znaků `#` z prefixů
- [x] 5.6 Napsat neutrální úvodní článek `co-je-spec-driven-development.md` (princip SDD, cyklus záměr → specifikace → plán → implementace → ověření, role specifikace při práci s AI, nástroje jen jako příklady s odkazy na oficiální zdroje) a ověřit, že je dostupný na `/clanky/co-je-spec-driven-development/`

## 6. Stránky

- [x] 6.1 Vytvořit úvodní stránku: nadpis, úvodní text (max. 3 věty, neutrální), scénář WHEN „nevíte, co je spec-driven development“ / THEN „Začněte úvodním článkem →“, jemná mřížka v pozadí úvodní sekce, a ověřit, že scénář je vidět bez posouvání na 1280×800
- [x] 6.2 Doplnit na úvodní stránku obecný cyklus SDD (Záměr, Specifikace, Plán, Implementace, Ověření) a pět nejnovějších článků a ověřit, že se koncepty nezobrazují a na 320 px jsou kroky pod sebou
- [x] 6.3 Vytvořit stránku `/jak-vznikl-tento-web/` s popisem cyklu propose → apply → archive, větou, že volba OpenSpec není doporučením, a odkazy na `openspec/specs/` a `openspec/changes/archive/` v repozitáři a ověřit odkazy

## 7. Závěrečné ověření

- [x] 7.1 Ověřit, že na šířce 320 px žádná stránka nemá vodorovné posouvání
- [x] 7.2 Spustit `npx astro check` a `npm run build` bez chyb a varování
- [x] 7.3 Projít web lokálně (`npm run preview`) ve světlém i tmavém režimu proti všem scénářům ve specs této změny a ověřit, že jsou splněné
