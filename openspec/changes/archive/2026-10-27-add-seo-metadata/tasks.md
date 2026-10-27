## 1. Data a nastavení

- [x] 1.1 Přidat `site.authorProfiles` (`https://github.com/lukasbursa`) do `src/site.config.ts` a ověřit přes `npm run check`
- [x] 1.2 Přidat `articleModifiedDate()` do `src/lib/articles.ts` a `toolModifiedDate()` do `src/lib/tools.ts` podle rozhodnutí 4 v design.md a ověřit přes `npm run check`
- [x] 1.3 Napsat `src/lib/structured-data.ts` (`websiteData()`, `articleData()`, `toolData()`, `breadcrumbData()`, autor s `@id`) podle rozhodnutí 1 a 2 a ověřit přes `npm run check`

## 2. Hlavička stránky

- [x] 2.1 Rozšířit `SeoHead.astro` o `<meta name="author">`, prop `structuredData` (jeden `@graph`, serializace s náhradou `<` za `<`, `is:inline`, `set:html`) a prop `noindex`. Ověřit v `dist/jak-vznikl-tento-web/index.html`, že má meta autora a žádný JSON-LD
- [x] 2.2 Úvodní stránka předá `websiteData()`. Ověřit v `dist/index.html`, že JSON-LD jde naparsovat (`JSON.parse`) a obsahuje `WebSite` s `publisher` odkazujícím na `#autor`
- [x] 2.3 Přehledy `/clanky/` a `/nastroje/` předají `breadcrumbData()`. Ověřit v `dist/`, že `BreadcrumbList` má dvě položky se správnými adresami
- [x] 2.4 Stránka článku předá `articleData()` a `breadcrumbData()` a `modifiedTime` jen s `updatedDate`. Ověřit v `dist/clanky/co-je-spec-driven-development/index.html` scénář „Strukturovaná data článku“ a v `dist/clanky/srovnani-nastroju/index.html` scénář „Článek bez aktualizace“
- [x] 2.5 Stránka nástroje předá `toolData()`, `breadcrumbData()` a `modifiedTime` z `toolModifiedDate()`. Ověřit v `dist/nastroje/openspec/index.html` scénáře „Strukturovaná data nástroje“ a „Drobečková navigace“. U nástroje bez webu (jen repozitář) ověřit, že `url` je repozitář
- [x] 2.6 Dočasně změnit popis jednoho článku na text s `"` a `</script>`, sestavit a ověřit, že JSON-LD jde naparsovat a stránka se nerozbila. Změnu vrátit
- [x] 2.7 `404.astro` zapne `noindex`. Ověřit v `dist/404.html` značku `<meta name="robots" content="noindex">` a že jiné stránky ji nemají

## 3. Autor v bloku metadat

- [x] 3.1 Přidat řádek `autor:` do bloku metadat na stránce článku (za data, před štítky) a nástroje (na konec). Ověřit v prohlížeči na `/clanky/co-je-spec-driven-development/` a `/nastroje/openspec/` ve světlém i tmavém režimu a na šířce 320 px

## 4. Sitemap

- [x] 4.1 Napsat `src/lib/sitemap-lastmod.ts` a napojit ho do `serialize()` v `astro.config.mjs` podle rozhodnutí 5. Ověřit v `dist/sitemap-0.xml`, že články a nástroje mají `lastmod` podle data poslední změny, `/clanky/`, `/nastroje/` a `/` mají maxima a `/jak-vznikl-tento-web/` `lastmod` nemá
- [x] 4.2 Dočasně odebrat z `SeoHead` výpis `article:published_time`, sestavit a ověřit, že build selže s chybou, která uvede soubor stránky. Změnu vrátit

## 5. Server

- [x] 5.1 Doplnit do `public/.htaccess` přesměrování `index.html` podle rozhodnutí 6 s komentářem, proč je tam `THE_REQUEST`. Ověřit lokálně systémovým `httpd` s `AllowOverride All` nad `dist/` a hlavičkou `Host: specdriven.cz` všechny tři scénáře požadavku „Adresy bez index.html“ a že dosavadní přesměrování (www, koncové lomítko) a stav 404 fungují dál

## 6. Dokumentace a kontrola

- [x] 6.1 Doplnit `CLAUDE.md`: strukturovaná data skládá `src/lib/structured-data.ts` a `application/ld+json` pravidlu o JavaScriptu neodporuje, `lastmod` v sitemapě se čte z `article:*_time` ve vygenerovaných stránkách, datum změny nástroje zahrnuje datum ověření
- [x] 6.2 Spustit `npm run check`, `npm run build`, `openspec validate add-seo-metadata --strict` a ověřit, že projdou bez chyb
- [x] 6.3 Po nasazení ověřit přesměrování `index.html` přes `curl -I` na produkci a strukturovaná data úvodní stránky, článku a nástroje ve Validátoru schema.org a v Testu výsledků s rozšířenými funkcemi od Googlu (bez chyb, varování nevadí)
