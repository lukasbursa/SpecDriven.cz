## 1. Písmo a závislost

- [x] 1.1 Stáhnout z oficiálního repozitáře IBM Plex soubory `IBMPlexSans-Regular.ttf`, `IBMPlexSans-SemiBold.ttf`, `IBMPlexMono-Regular.ttf`, `IBMPlexMono-SemiBold.ttf` (úplná znaková sada) a licenci `OFL.txt` do `src/assets/fonts/og/`. Ověřit přes `file`, že jde o TrueType, a v licenci, že je to SIL OFL 1.1
- [x] 1.2 Přidat závislost `@resvg/resvg-js` a ověřit, že `npm install` projde a `npm ls @resvg/resvg-js` ukazuje nainstalovanou verzi

## 2. Převod a kontrola

- [x] 2.1 Napsat `src/lib/og-image.ts`: cesta k SVG z `filePath` záznamu, `ogImagePath()`, kontrola SVG podle rozhodnutí 4 a vykreslení přes resvg s písmy z 1.1 a `loadSystemFonts: false`. Ověřit přes `npm run check`
- [x] 2.2 Vytvořit endpoint `src/pages/og/[collection]/[slug].png.ts` podle rozhodnutí 2 s varováním o publikovaných stránkách bez SVG. Ověřit s dočasným testovacím SVG u jednoho článku, že `npm run build` vytvoří `dist/og/clanky/<slug>.png` o rozměru 1200×630 a vypíše varování pro ostatní stránky
- [x] 2.3 Ověřit scénář „České znaky v obrázku“: testovací SVG s textem „Příliš žluťoučký kůň“ v IBM Plex Sans 600 a Mono 400 vykreslit a prohlédnout PNG. Na stroji, kde IBM Plex není nainstalované v systému, nebo v GitHub Actions (artefakt ze zkušebního běhu)
- [x] 2.4 Ověřit scénáře požadavku „Kontrola obrázku při sestavení“: dočasně do testovacího SVG přidat postupně `<image href="https://…">`, `viewBox="0 0 1000 1000"`, `font-family="Arial"`, `<script>` a `onload=` a pokaždé ověřit, že build selže s chybou, která uvede soubor a důvod. Ověřit, že `href="#id"` a `url(#gradient)` projdou
- [x] 2.5 Ověřit scénář „Obrázek konceptu“: testovací článek s `draft: true` a SVG, po buildu `dist/og/clanky/` jeho PNG neobsahuje. Testovací soubory z úkolů 2.2–2.5 smazat

## 3. Napojení na stránky

- [x] 3.1 Rozšířit `SeoHead.astro` o prop `image` (výchozí `site.ogImage`) a `og:image:alt` s názvem stránky. Stránky článku a nástroje předají `ogImagePath()`. Ověřit v `dist/`, že stránka s obrázkem má v `og:image` absolutní adresu `https://specdriven.cz/og/…png`, stránka bez obrázku a úvodní stránka mají `og-default.png` a všechny mají `og:image:alt`
- [x] 3.2 Pokud je implementovaná změna `add-seo-metadata`, předat stejnou adresu do `image` ve strukturovaných datech článku a nástroje a ověřit v `dist/`, že se shoduje s `og:image`

## 4. Šablona a pravidla

- [x] 4.1 Vytvořit `src/assets/og-template.svg` s pevnými prvky podle rozhodnutí 6 (pozadí s mřížkou, logo z `public/favicon.svg` a nápis „SpecDriven.cz“, modrý pruh) a vyznačenými oblastmi pro štítek, název a motiv. Vykreslit ji dočasně jako SVG článku a ověřit pohledem, že pevné prvky odpovídají `public/og-default.png`
- [x] 4.2 Doplnit do `CLAUDE.md` sekci „Obrázky pro sdílení“ s pravidly z rozhodnutí 6, cestou k šabloně, postupem kontroly přes dev server (`/og/clanky/<slug>.png`) a poznámkou, že úprava textu v existujícím `.og.svg` spadá pod výjimku pro `src/content/`
- [x] 4.3 Doplnit do `openspec/config.yaml` `rules.tasks` s pravidlem z rozhodnutí 6. Ověřit, že `openspec instructions tasks --change add-og-images --json` pravidlo vrací
- [x] 4.4 Doplnit do `CONTRIBUTING.md`, že obrázek pro sdílení je nepovinný a doplní ho správce

## 5. Obrázky pro obsah

- [x] 5.1 Nakreslit `co-je-spec-driven-development.og.svg` podle pravidel v `CLAUDE.md` a zkontrolovat vykreslené PNG (nic nepřetéká ani se nepřekrývá, text je čitelný i zmenšený na šířku 500 px)
- [x] 5.2 Nakreslit `srovnani-nastroju.og.svg` a zkontrolovat vykreslené PNG stejně jako v 5.1
- [x] 5.3 Pokud je článek `konec-vibe-codingu` publikovaný, nakreslit `konec-vibe-codingu.og.svg` a zkontrolovat vykreslené PNG stejně jako v 5.1
- [x] 5.4 Nakreslit obrázky pro všech šest nástrojů v `src/content/tools/` (motiv z postupu nástroje, žádné logo) a každý zkontrolovat stejně jako v 5.1
- [x] 5.5 Prohlédnout všechny obrázky vedle sebe a ověřit, že pevné prvky, velikosti písma a barvy jsou u všech stejné. Odchylky opravit

## 6. Kontrola

- [x] 6.1 Spustit `npm run check`, `npm run build` a `openspec validate add-og-images --strict` a ověřit, že projdou bez chyb a build nevypíše žádné varování o chybějícím obrázku
- [x] 6.2 Po nasazení ověřit náhled `/clanky/co-je-spec-driven-development/` a `/nastroje/openspec/` v LinkedIn Post Inspector
