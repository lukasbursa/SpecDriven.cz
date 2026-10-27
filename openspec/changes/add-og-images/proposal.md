## Why

Při sdílení na LinkedInu, ve Slacku nebo v Messengeru se teď u každé stránky webu zobrazí stejný obrázek `og-default.png`. Odkazy na různé články tak v náhledu vypadají stejně a nic neříkají o tom, o čem článek je. Články na webu vznikají s pomocí AI, a Claude umí obrázek nakreslit jako SVG. Každý článek a nástroj proto může mít vlastní obrázek bez práce navíc pro autora.

## What Changes

- Článek i nástroj může mít vedle svého souboru obrázek pro sdílení jako SVG (`src/content/articles/<slug>.og.svg`, `src/content/tools/<slug>.og.svg`). Kreslí ho Claude při psaní článku nebo stránky nástroje podle pravidel v `CLAUDE.md`: pevný rozměr 1200×630, název stránky, motiv ze světa specifikací vztažený k obsahu a barvy a písmo webu.
- Build převede SVG na PNG s písmem IBM Plex, které je součástí buildu, ne systému. Výsledek je na `/og/clanky/<slug>.png` a `/og/nastroje/<slug>.png` a stránka na něj odkazuje v `og:image`.
- Stránka bez vlastního SVG dál použije `og-default.png` a build vypíše varování, které stránky obrázek nemají.
- SVG s odkazem na cizí soubor, se skriptem nebo se špatným rozměrem shodí build s chybou, která uvede soubor.
- Obrázky dostanou všechny dnes publikované články a nástroje.
- Do `openspec/config.yaml` přibude pravidlo pro úkoly: změna, která přidává článek nebo nástroj nebo mění jeho název, obsahuje úkol nakreslit nebo upravit obrázek a zkontrolovat vykreslené PNG.
- Stránky dostanou `og:image:alt` s názvem stránky.

Mimo rozsah: obrázky pro ostatní stránky (úvodní stránka, přehledy, „Jak vznikl tento web“ dál používají `og-default.png`), tmavá varianta obrázku, generování obrázků přes AI službu s API klíčem, automatická kontrola, jestli se text do obrázku vešel (kontroluje se pohledem na vykreslené PNG).

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `seo`: náhled při sdílení článku a nástroje ukazuje vlastní obrázek stránky. Nový požadavek na zdroj obrázku, jeho převod, náhradní obrázek a kontrolu SVG při buildu.

## Impact

- Nová závislost `@resvg/resvg-js` (převod SVG na PNG) a čtyři soubory písma IBM Plex Sans a Mono ve formátu TTF v repozitáři i s licencí OFL. Používají se jen při buildu, do prohlížeče se nic nového nenačítá.
- Nový endpoint `src/pages/og/[collection]/[slug].png.ts` a modul `src/lib/og-image.ts` (nalezení, kontrola a převod SVG).
- `src/components/SeoHead.astro`: prop s obrázkem stránky a `og:image:alt`. Stránky článku a nástroje mu obrázek předají.
- Nové soubory `*.og.svg` v `src/content/articles/` a `src/content/tools/` a šablona `src/assets/og-template.svg` s pevnými prvky (logo, mřížka, pruh).
- `openspec/config.yaml` (pravidlo pro úkoly), `CLAUDE.md` (pravidla kreslení a jak obrázek zkontrolovat), `CONTRIBUTING.md` (obrázek je nepovinný, doplní ho správce).
- Souvisí se změnou `add-seo-metadata`: strukturovaná data článku uvádějí obrázek pro sdílení. Změna, která se implementuje později, napojí vlastní obrázek i tam.
- Článek `konec-vibe-codingu` ze změny `add-vibe-coding-article` dostane obrázek v této změně, pokud bude v tu dobu publikovaný.
