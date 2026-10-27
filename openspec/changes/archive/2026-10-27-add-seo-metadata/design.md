## Context

Metadata pro vyhledávače skládá jediná komponenta `src/components/SeoHead.astro`, kterou vkládá `BaseLayout.astro`. Stránky jí předávají název, popis, `type` a data publikace a změny. Nastavení webu (název, autor, adresa) je v `src/site.config.ts`. Sitemap generuje integrace `@astrojs/sitemap` v `astro.config.mjs`. Její funkce `serialize()` dostane jen adresu stránky a běží v konfiguraci, kde kolekce obsahu (`astro:content`) nejsou dostupné. Konfigurace serveru je v `public/.htaccess` a jde ověřit lokálně systémovým `httpd` (viz `CLAUDE.md`).

Motivaci popisuje proposal.md, požadavky jsou ve specifikacích změny.

## Goals / Non-Goals

**Goals:**
- Všechna nová metadata počítat z metadat obsahu a z `site.config.ts`, nic nepsat ručně do stránek.
- Datum poslední změny určit na jednom místě a použít ho v hlavičce stránky, ve strukturovaných datech i v sitemapě.
- Nepřidat žádnou závislost ani skript, který běží v prohlížeči.

**Non-Goals:**
- Bohaté výsledky ve vyhledávání (hvězdičky, FAQ a podobně). Strukturovaná data mají popsat obsah, ne honit konkrétní zobrazení.
- Ověřování strukturovaných dat při buildu proti schématu schema.org. Ověří se jednorázově nástroji vyhledávačů (viz Migration Plan).

## Decisions

### 1. Strukturovaná data skládá modul, `SeoHead` je jen vypíše

Nový modul `src/lib/structured-data.ts` exportuje funkce, které z dat vrátí obyčejné objekty: `websiteData()`, `articleData()`, `toolData()` a `breadcrumbData()`. Stránka zavolá, co potřebuje, a předá pole objektů do `SeoHead` v novém nepovinném propu `structuredData`. `SeoHead` je zabalí do jednoho `{"@context": "https://schema.org", "@graph": [...]}` a vypíše jako jeden `<script type="application/ld+json" is:inline>`.

Autor je v grafu jednou jako `Person` s `@id` `https://specdriven.cz/#autor` a `Article` i `WebSite` na něj odkazují přes `@id`. Strukturovaná data tak neopakují stejný objekt na několika místech.

Serializace: `JSON.stringify` a potom náhrada `<` za `<`. JSON zůstane platný a žádný text z metadat nemůže ukončit element `<script>`. Vkládá se přes `set:html`, protože Astro by jinak escapovalo uvozovky na HTML entity.

`is:inline` je nutné: bez něj by Astro skript zpracovalo jako modul. Do `CLAUDE.md` přibude věta, že `application/ld+json` jsou data, která prohlížeč nespouští, takže pravidlu „web nepoužívá JavaScript“ neodporují.

Alternativa: skládat objekty přímo v `SeoHead` z propů (`type`, název, data). `SeoHead` by pak musel znát nástroje, drobečkovou navigaci a typ stránky a rostl by s každým typem obsahu. Oddělené funkce jdou navíc použít i jinde.

### 2. Tvar dat podle typu stránky

| Stránka | Objekty |
|---|---|
| `/` | `WebSite` (název, adresa, popis, `inLanguage: cs`, `publisher` → autor) |
| `/clanky/`, `/nastroje/` | `BreadcrumbList` |
| `/clanky/<slug>/` | `Article`, `BreadcrumbList` |
| `/nastroje/<slug>/` | `Article` s `about` → `Thing`, `BreadcrumbList` |

`Article` má `headline`, `description`, `url` a `mainEntityOfPage` (kanonická adresa), `image` (adresa obrázku pro sdílení), `inLanguage`, `datePublished`, `dateModified`, `author` a `publisher` (obojí autor). Data jsou celé datum a čas v UTC (`toISOString()`, například `2026-10-26T00:00:00.000Z`), stejně jako v `article:published_time`. Původně byla ve tvaru `YYYY-MM-DD`, protože obsah nemá čas, ale Test výsledků s rozšířenými funkcemi od Googlu u nich hlásil „Invalid datetime value“ a „missing a timezone“ (ověřeno po nasazení).

Nástroj je `Article`, jehož předmětem (`about`) je `Thing` s `name`, `url` (oficiální web, a když chybí, repozitář) a `sameAs` (repozitář, pokud je jiný než `url`). Samotný nástroj jako hlavní typ stránky jsme zamítli, protože stránka je text o nástroji, ne nástroj samotný, a už teď má `og:type` `article`.

Předmět byl původně `SoftwareApplication` s `applicationCategory: "DeveloperApplication"`. Google ho ale vyhodnocuje i jako vnořený objekt a hlásil u něj chybu „Two or more properties required from the following: offers, aggregateRating, applicationCategory, operatingSystem“ (ověřeno po nasazení). Uvažované alternativy:

- **Doplnit `operatingSystem`** do metadat nástroje z oficiálních zdrojů. Položka by byla platná, jenže u metodik (BMAD-METHOD) operační systém nedává smysl. Rozšířený výsledek pro aplikaci by navíc bez hodnocení a ceny stejně nic neukázal.
- **Nechat neplatnou položku.** Hodnocení stránky to neovlivní, ale test by trvale hlásil chybu.

`Thing` Google nevaliduje a vazba na oficiální web a repozitář zůstává. Ztrácí se jen informace, že jde o software.

Drobečková navigace: `SpecDriven.cz` (`/`) → `Články` (`/clanky/`) nebo `Nástroje` (`/nastroje/`) → název stránky. Odpovídá cestě `clanky / <slug>`, kterou stránky ukazují nad blokem metadat.

### 3. Autor v `site.config.ts`

`site.author` zůstává řetězec se jménem (používá ho patička). Přibude `site.authorProfiles` s polem adres profilů, zatím jen `https://github.com/lukasbursa`. `Person` dostane `name` a `sameAs` z tohoto pole. Pole `author` ve schématu obsahu nepřidáváme: web má jednoho autora a pole půjde doplnit, až přijde první článek od někoho jiného.

Blok metadat (`Frontmatter.astro`) dostane u článku i nástroje řádek `{ key: 'autor', value: site.author }`. U článku za data a před štítky, u nástroje na konec. `SeoHead` vypíše `<meta name="author">` na každé stránce.

### 4. Datum poslední změny na jednom místě

`src/lib/articles.ts` dostane `articleModifiedDate(article)` (`updatedDate ?? pubDate`) a `src/lib/tools.ts` dostane `toolModifiedDate(tool)` (nejnovější z `pubDate`, `updatedDate`, `verifiedDate`). Stránky je předají do `SeoHead` jako `modifiedTime` a do strukturovaných dat jako `dateModified`.

U článku se `article:modified_time` dál vypisuje jen při vyplněném `updatedDate` (požadavek „Datum poslední změny stránky“), takže stránka článku předá `modifiedTime` jen tehdy. Strukturovaná data mají `dateModified` vždy, Google ho tam doporučuje.

### 5. `lastmod` v sitemapě se čte z vygenerovaných stránek

Sitemap se generuje až po zápisu stránek do výstupní složky. Modul `src/lib/sitemap-lastmod.ts` projde `clanky/*/index.html` a `nastroje/*/index.html` a z každé stránky vezme `article:modified_time`, a když chybí, `article:published_time`. Tyto hodnoty spočítala stránka z metadat obsahu podle rozhodnutí 4, sitemap je tedy jen přebírá. Z nich se dopočítají maxima pro `/clanky/`, `/nastroje/` a `/`. Pro ostatní adresy vrátí `serialize()` položku beze změny, takže `lastmod` nemají.

Stránka článku nebo nástroje bez obou metadat znamená chybu v šabloně, a build proto selže s chybou, která uvede soubor.

Data proto nečte `serialize()`, ale vlastní malá integrace v hooku `astro:build:done`, zařazená v `astro.config.mjs` před integrací sitemap. `serialize()` z ní data jen přebírá. Integrace sitemap totiž výjimku ze `serialize()` zachytí, jen ji zaloguje a sitemap nezapíše, ale build skončí úspěšně (ověřeno při implementaci, návratový kód 0). Nasazení by pak sitemap ze serveru smazalo. Výjimka z vlastního hooku build shodí. Hook navíc dostane skutečnou výstupní složku (`dir`), takže cesta k `dist/` není v konfiguraci napsaná natvrdo.

Uvažované alternativy:

- **Číst frontmatter souborů v `src/content/` přímo v konfiguraci.** Musela by se znovu napsat logika, kterou dnes má schéma a knihovny: převod dat, vynechání konceptů, adresa ze slugu, výpočet data nástroje. Tahle pravidla by pak byla na dvou místech.
- **Vlastní sitemap jako endpoint s `getPublishedArticles()` místo integrace.** Statické stránky by se musely vyjmenovat ručně a novou stránku by šlo snadno vynechat, přitom specifikace vyžaduje všechny veřejné stránky.
- **Datum posledního commitu souboru.** Posunulo by `lastmod` i při opravě překlepu. Datum v metadatech je úmyslné rozhodnutí autora a čtenář ho vidí i na stránce.

### 6. Přesměrování `index.html` v `.htaccess`

Nové pravidlo před pravidlem pro koncové lomítko:

```apache
RewriteCond %{THE_REQUEST} \s/(.*/)?index\.html[\s?]
RewriteRule ^(.*/)?index\.html$ https://specdriven.cz/$1 [R=301,L]
```

Podmínka na `THE_REQUEST` (původní řádek požadavku od klienta) je nutná. `DirectoryIndex` totiž adresu `/clanky/` interně přepíše na `/clanky/index.html` a pravidlo bez podmínky by pak přesměrovávalo i adresu složky, takže vznikne smyčka. Query string se k cíli připojí automaticky.

### 7. `noindex` na stránce 404

`SeoHead` dostane nepovinný prop `noindex` a `404.astro` ho zapne. Pravidlo v `.htaccess`, které by vracelo stav 404 i pro `/404.html`, jsme zamítli: pletlo by se s `ErrorDocument`, který na stejný soubor odkazuje, a meta značka stačí.

## Risks / Trade-offs

- **[Nástroje vyhledávačů hlásí u strukturovaných dat varování]** Například doporučené pole, které nemáme. → Varování nevadí, opravují se jen chyby. Ověří se po nasazení (Migration Plan).
- **[`lastmod` závisí na tvaru značek v HTML]** Když se změní, jak `SeoHead` vypisuje `article:*_time`, čtení z `dist/` přestane fungovat. → Chybějící datum u stránky článku nebo nástroje shodí build (rozhodnutí 5, vlastní hook, ne `serialize()`), takže se to nestane potichu. V `CLAUDE.md` bude vazba popsaná.
- **[Pravidlo v `.htaccess` může na hostingu způsobit smyčku]** → Ověřit lokálně přes `httpd` s `AllowOverride All` nad `dist/` a po nasazení přes `curl -I` všechny tři scénáře požadavku „Adresy bez index.html“. Při potížích revert commitu a nové nasazení.
- **[Obrázek ve strukturovaných datech]** Změna `add-og-images` přinese vlastní obrázek pro každou stránku. → `articleData()` a `toolData()` berou adresu obrázku jako parametr a stránka předává stejnou hodnotu jako do `og:image`. Která změna se implementuje později, napojí obrázek na obě místa.

## Migration Plan

1. Implementovat, ověřit `npm run check`, `npm run build` a výstup v `dist/`, pravidlo v `.htaccess` lokálně přes `httpd`.
2. Push do `main` web nasadí.
3. Po nasazení ověřit přesměrování přes `curl -I` a strukturovaná data ve Validátoru schema.org a v Testu výsledků s rozšířenými funkcemi od Googlu (oba načtou veřejnou adresu).
4. Ručně, mimo repozitář: odeslat `https://specdriven.cz/sitemap-index.xml` v Google Search Console, Bing Webmaster Tools a Seznam Webmaster.

Návrat zpět: revert commitu a push.
