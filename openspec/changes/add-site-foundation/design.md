## Context

Repozitář zatím obsahuje jen konfiguraci OpenSpec. Motivace je v proposal.md (sekce Why), požadované chování popisují specs této změny. Web je čistě obsahový (články, statické stránky), nemá uživatelské účty ani backend a bude běžet na statickém hostingu.

Zdrojový kód je veřejný a slouží jako ukázka SDD, proto má být struktura projektu malá a čitelná i pro lidi, kteří Astro neznají.

Vizuální směr byl ověřen na náhledu (úvodní stránka a článek, světlý i tmavý režim) a schválen: „web jako specifikace“ ve střední míře.

## Goals / Non-Goals

**Goals:**
- Statický web bez JavaScriptu v prohlížeči.
- Přidání nového článku = přidání jednoho Markdown souboru, bez zásahu do kódu.
- Chyby v metadatech článků se odhalí při sestavení, ne až v produkci.
- Jediné místo pro konfiguraci webu (doména, název, autor, URL repozitáře).
- Výrazný, rozpoznatelný vzhled, který připomíná specifikaci, ale nezhoršuje čitelnost.

**Non-Goals:**
- Sekce Nástroje, Slovník, vyhledávání, komentáře, newsletter, komunita, vícejazyčnost: přijdou jako samostatné změny.
- Nasazení a CI/CD: řeší se zvlášť, tato změna končí funkčním `npm run build`.
- Ruční přepínač světlého a tmavého režimu (vyžadoval by JavaScript): režim se řídí systémem.
- Logo nad rámec textového wordmarku.

## Decisions

### Astro jako generátor statického webu
Astro (aktuálně řada 7) generuje čisté HTML, nativně podporuje Markdown/MDX a má typované content collections se schématem metadat. Statický výstup lze nasadit kamkoli.
- *Alternativy:* Next.js (zbytečně těžký runtime pro obsahový web), Hugo (rychlý, ale šablony v Go jsou pro JS/TS komunitu méně přístupné), VitePress/Starlight (silně zaměřené na dokumentaci, méně volnosti pro vlastní vzhled).

### Content collection `articles` se Zod schématem
Články leží v `src/content/articles/*.md(x)`. Schéma v `src/content.config.ts` vynucuje povinná metadata a délku popisu (spec `articles` → Povinná metadata článku), takže neplatný článek shodí build s chybou identifikující soubor. Slug se odvozuje z názvu souboru.
- *Alternativa:* volné Markdown stránky v `src/pages/` – bez validace metadat a bez jednoduchého výpisu.

### Koncepty filtrované na jednom místě
Pomocná funkce `getPublishedArticles()` vrací publikované články seřazené od nejnovějšího. Používají ji výpis, úvodní stránka, RSS i generování stránek článků, takže koncept nemůže omylem prosáknout jinam. Sitemap obsahuje jen vygenerované stránky, takže koncepty v ní automaticky nejsou.

### Konfigurace v `src/site.config.ts`
Doména, název, podtitul, autor, URL repozitáře (včetně větve pro odkazy do složek) a URL OpenSpec jsou v jednom typovaném objektu. Komponenty si hodnoty berou odtud.

### Vizuální směr: „web jako specifikace“, střední cesta
Rám stránky přebírá jazyk specifikací: monospace prefixy `##`/`###` před nadpisy, scénáře WHEN/THEN, frontmatter článku jako blok metadat, stavový řádek v patičce. Tento jazyk je společný BDD a psaní požadavků obecně, není vázaný na jeden nástroj. Tělo článků je naopak klidné: bezpatkové písmo, šířka řádku ~68 znaků, řádkování 1,7.
- Barvy: jediný akcent – modrá. Světlý režim „papír“ (teplá bílá `#FAFAF7`, inkoust `#14202E`, akcent `#1F5FBF`), tmavý režim „blueprint“ (`#0B1A2E`, text `#E6EEF8`, akcent `#7DB3FF`). Jemná modrá mřížka jen v úvodní sekci.
- Prefixy a oddělovače jsou šedé (ne v akcentu), aby po desátém článku neobtěžovaly, a jsou skryté pro čtečky (spec `site-layout` → Dekorativní prvky specifikace).
- *Alternativy:* plně „terminálový“ vzhled (monospace i v textu – horší čitelnost dlouhých článků), redakční magazín (čitelný, ale bez vazby na téma).

### CSS: čisté moderní CSS bez frameworku
Struktura:
- `src/styles/tokens.css` – barvy, písma, mezery a velikosti jako custom properties,
- `src/styles/base.css` – reset, typografie, odkazy, viditelný focus,
- `src/styles/prose.css` – styly obsahu článků (nadpisy s prefixy, seznamy, kód),
- komponenty (`Scenario.astro`, `StatusBar.astro`, …) mají vlastní scoped `<style>`.

Využívá `@layer` (reset → base → components → prose) pro předvídatelné pořadí, nativní vnořování, `clamp()` pro plynulé velikosti písma a `color-scheme: light dark` s funkcí `light-dark()`, takže obě barevné varianty jsou definované na jednom místě a bez JavaScriptu.
- *Alternativa:* Tailwind 4 – rychlý u velkých aplikací, ale web má jen asi deset komponent s výrazně vlastním vzhledem a utility třídy v HTML jsou pro vzdělávací repozitář hůře čitelné. Sass – zbytečný, nativní CSS už umí vnořování i proměnné.

### Písmo: IBM Plex Sans + IBM Plex Mono, hostované u nás
Plex Sans pro text a nadpisy, Plex Mono pro strukturní prvky (prefixy, štítky, data, frontmatter, stavový řádek). Obě rodiny k sobě patří a mají plnou podporu češtiny. Písma se instalují jako balíčky Fontsource a servírují z vlastní domény, načítají se jen podmnožiny `latin` a `latin-ext` a jen použité řezy (Sans 400/600 + italic 400, Mono 400/600).
- *Proč ne Google Fonts:* přenos IP adres návštěvníků Googlu je v EU právně sporný (LG München, 2022) a další doména zpomaluje první načtení.

### Komponenta `Scenario`
Jedna Astro komponenta vykresluje blok scénáře (nadpis „Scenario: …“, řádky WHEN/THEN). Používá se v úvodní sekci jako výzva a později v článcích přes MDX. Klíčová slova WHEN/THEN jsou skutečný text (čtečky je přečtou), prefix `####` je dekorativní.

### Stavový řádek z dat repozitáře
Utilita `getOpenSpecStatus()` při sestavení přečte přes `node:fs`:
- počet podsložek se souborem `spec.md` v `openspec/specs/`,
- počet podsložek v `openspec/changes/archive/` a z nejnovější (název ve tvaru `YYYY-MM-DD-<název>`) její datum a název.

Chybějící složka se bere jako nula, takže build nikdy kvůli stavu neselže. Hodnoty se počítají jen jednou za build a komponenta `StatusBar` je zobrazí v patičce. Nevolá se CLI `openspec`, takže build nezávisí na jeho instalaci.
- *Alternativa:* spouštět `openspec list --json` při buildu – přesnější, ale přidává závislost buildu na CLI a na hostingu.

### Zvýrazňování kódu
Vestavěný Shiki v Astru s tématem `css-variables`, napojeným na tokeny webu, aby bloky kódu ladily s papírem i blueprintem.

### Oficiální integrace
`@astrojs/mdx` (komponenty v článcích), `@astrojs/sitemap`, `@astrojs/rss`. Stránka 404 se ze sitemap vylučuje filtrem.

### Open Graph obrázek
Jeden statický obrázek `public/og-default.png` (1200×630) ve vizuálním stylu webu pro všechny stránky. Generování obrázků pro jednotlivé články je mimo rozsah.

### Formát dat
Data se formátují přes `Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long' })`, výsledek je např. „26. října 2026“. Ve stavovém řádku se používá krátký tvar „26. 10. 2026“.

## Risks / Trade-offs

- [Astro vydává nové major verze poměrně často] → Verze se zamkne v `package-lock.json`, upgrady půjdou jako samostatné změny.
- [`light-dark()` nepodporují prohlížeče starší než zhruba 2024] → Tokeny nejdřív deklarují světlou hodnotu jako zálohu, `light-dark()` ji přepíše jen tam, kde je podporována. Starý prohlížeč tak dostane čitelný světlý režim.
- [Vizuální prefixy mohou po čase působit rušivě] → Jsou šedé a malé. Pokud se ukáže, že ruší, jde je odebrat v jednom stylesheetu bez zásahu do obsahu.
- [Stavový řádek ukazuje stav v okamžiku buildu, ne živě] → Pro statický web je to v pořádku. Každé nasazení po archivaci změnu promítne.
- [Vlastní písma zvětšují první načtení (~80–100 kB)] → `font-display: swap`, jen potřebné řezy a podmnožiny, preload jen pro Plex Sans 400.
- [Jeden OG obrázek pro všechny stránky je méně atraktivní při sdílení] → Přijatelné pro start, generované obrázky mohou přijít jako samostatná změna.

## Open Questions

- Přesná URL veřejného GitHub repozitáře a jméno autora v patičce: doplní se do `src/site.config.ts`, na specifikaci ani struktuře to nic nemění.
- Fontsource, nebo vestavěné Fonts API Astra: pokud je v Astru 7 stabilní a splní požadavky (vlastní doména, podmnožiny), lze ho použít místo Fontsource. Chování webu se tím nemění.
- Volba hostingu (Cloudflare Pages / Vercel / Netlify) se řeší v samostatné změně pro nasazení.
