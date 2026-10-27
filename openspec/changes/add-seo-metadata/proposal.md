## Why

Základ SEO web má (titulky, popisy, kanonické adresy, Open Graph, sitemap), ale vyhledávačům zatím strojově neříká, co je na stránce za obsah, kdo ho napsal a kdy se naposledy změnil. U webu, který stojí na ověřených faktech s datem, jsou autor a datum změny právě to, podle čeho vyhledávače i AI asistenti posuzují důvěryhodnost. K tomu vrací server stejnou stránku i na adresách s `index.html`, takže vznikají duplicitní adresy.

## What Changes

- **Strukturovaná data (JSON-LD):** úvodní stránka popíše web (`WebSite`), článek a stránka nástroje se popíšou jako `Article` s autorem, daty publikace a změny. U nástroje bude navíc popsaný samotný nástroj (`SoftwareApplication`). Stránky článků, nástrojů a oba přehledy dostanou drobečkovou navigaci (`BreadcrumbList`).
- **Autor:** blok metadat na stránce článku i nástroje ukáže řádek `autor:`. Hlavička stránky dostane `<meta name="author">` a strukturovaná data autora jako osobu s odkazem na profil na GitHubu. Web má jednoho autora z `src/site.config.ts`.
- **Datum změny v sitemapě:** stránky článků a nástrojů dostanou v sitemapě `lastmod` podle data aktualizace, případně publikace, u nástroje i podle data ověření. Přehledy a úvodní stránka převezmou nejnovější datum svého obsahu. Stránky bez data z metadat `lastmod` mít nebudou.
- **Datum změny nástroje:** jako datum poslední změny stránky nástroje se bere nejnovější z dat publikace, aktualizace a ověření. Platí to pro `article:modified_time`, strukturovaná data i sitemap.
- **Adresy s `index.html`:** server je trvale přesměruje na adresu složky (`/index.html` → `/`, `/clanky/index.html` → `/clanky/`).
- **Stránka 404 mimo index:** stránka 404 dostane `<meta name="robots" content="noindex">`, protože na přímé adrese `/404.html` vrací server stav 200.

Mimo rozsah: přesměrování z HTTP na HTTPS a hlavička HSTS (na tomto hostingu nejde přesměrování udělat, viz design `add-ftp-deploy`, a kanonická adresa na `https` už vyhledávačům stačí), obrázky pro sdílení jednotlivých článků (samostatná změna `add-og-images`), samostatná stránka o autorovi a více autorů.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `seo`: nové požadavky na strukturovaná data, autora v metadatech stránky, datum změny v sitemapě a vyřazení stránky 404 z indexu.
- `articles`: blok metadat na stránce článku uvádí autora.
- `tools`: blok metadat na stránce nástroje uvádí autora.
- `hosting`: nový požadavek na přesměrování adres s `index.html`.

## Impact

- `src/components/SeoHead.astro`: meta autora, strukturovaná data, `noindex`.
- Nový modul `src/lib/structured-data.ts`, který skládá objekty JSON-LD.
- `src/site.config.ts`: profil autora pro strukturovaná data.
- `src/lib/tools.ts`: datum poslední změny nástroje.
- Stránky `src/pages/index.astro`, `clanky/index.astro`, `clanky/[slug].astro`, `nastroje/index.astro`, `nastroje/[slug].astro`, `404.astro`.
- `astro.config.mjs`: `serialize` v integraci sitemap.
- `public/.htaccess`: přesměrování `index.html`.
- `CLAUDE.md`: zmínka, že `<script type="application/ld+json">` jsou data a pravidlu o JavaScriptu neodporují, a popis `lastmod`.
- Žádné nové závislosti, v prohlížeči dál neběží žádný nový skript.
