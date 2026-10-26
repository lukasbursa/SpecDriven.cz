## Context

Repozitář zatím obsahuje jen konfiguraci OpenSpec. Motivace je v proposal.md (sekce Why), požadované chování popisují specs této změny. Web je čistě obsahový (články, statické stránky), nemá uživatelské účty ani backend a bude běžet na statickém hostingu.

Zdrojový kód je veřejný a slouží jako ukázka SDD, proto má být struktura projektu malá a čitelná i pro lidi, kteří Astro neznají.

## Goals / Non-Goals

**Goals:**
- Statický web s minimem JavaScriptu v prohlížeči (ideálně žádný).
- Přidání nového článku = přidání jednoho Markdown souboru, bez zásahu do kódu.
- Chyby v metadatech článků se odhalí při sestavení, ne až v produkci.
- Jediné místo pro konfiguraci webu (doména, název, autor, URL repozitáře).

**Non-Goals:**
- Vyhledávání, komentáře, newsletter, komunita, vícejazyčnost: přijdou jako samostatné změny.
- Nasazení a CI/CD: řeší se zvlášť, tato změna končí funkčním `npm run build`.
- Vlastní grafický design a logo: stačí čistá typografie, design se může vylepšit později.

## Decisions

### Astro jako generátor statického webu
Astro generuje čisté HTML, nativně podporuje Markdown/MDX a má typované content collections se schématem metadat. Statický výstup lze nasadit kamkoli.
- *Alternativy:* Next.js (zbytečně těžký runtime pro obsahový web), Hugo (rychlý, ale šablony v Go jsou pro JS/TS komunitu méně přístupné), VitePress/Starlight (silně zaměřené na dokumentaci, méně volnosti pro blogový a komunitní obsah).

### Content collection `articles` se Zod schématem
Články leží v `src/content/articles/*.md(x)`. Schéma v `src/content.config.ts` vynucuje povinná metadata a délku popisu (spec `articles` → Povinná metadata článku), takže neplatný článek shodí build s chybou identifikující soubor. Slug se odvozuje z názvu souboru.
- *Alternativa:* volné Markdown stránky v `src/pages/` – bez validace metadat a bez jednoduchého výpisu.

### Koncepty filtrované na jednom místě
Pomocná funkce `getPublishedArticles()` vrací publikované články seřazené od nejnovějšího. Používají ji výpis, úvodní stránka, RSS i generování stránek článků, takže koncept nemůže omylem prosáknout jinam. Sitemap obsahuje jen vygenerované stránky, takže koncepty v ní automaticky nejsou.

### Konfigurace v `src/site.config.ts`
Doména, název, podtitul, autor, URL repozitáře a URL OpenSpec jsou v jednom typovaném objektu. Komponenty si hodnoty berou odtud.

### Styly: čisté CSS s custom properties
Jeden globální stylesheet s barevnými tokeny pro světlý a tmavý režim (`prefers-color-scheme`), systémový font stack, bez CSS frameworku. Méně závislostí a čitelný kód pro návštěvníky repozitáře.
- *Alternativa:* Tailwind – rychlejší vývoj, ale přidává build závislost a utility třídy v HTML jsou pro vzdělávací repozitář hůře čitelné.

### Oficiální integrace
`@astrojs/mdx` (komponenty v článcích do budoucna), `@astrojs/sitemap`, `@astrojs/rss`. Stránka 404 se ze sitemap vylučuje filtrem.

### Open Graph obrázek
Jeden statický obrázek `public/og-default.png` (1200×630) pro všechny stránky. Generování obrázků pro jednotlivé články je mimo rozsah.

### Formát dat
Data se formátují přes `Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long' })`, výsledek je např. „26. října 2026“.

## Risks / Trade-offs

- [Astro vydává nové major verze poměrně často] → Verze se zamkne v `package-lock.json`, upgrady půjdou jako samostatné změny.
- [Systémový font vypadá na každé platformě trochu jinak] → Pro obsahový web je to přijatelné. Vlastní font se dá přidat později jako vylepšení designu.
- [Jeden OG obrázek pro všechny stránky je méně atraktivní při sdílení] → Přijatelné pro start, generované obrázky mohou přijít jako samostatná změna.

## Open Questions

- Přesná URL veřejného GitHub repozitáře a jméno autora v patičce: doplní se do `src/site.config.ts`, na specifikaci ani struktuře to nic nemění.
- Volba hostingu (Cloudflare Pages / Vercel / Netlify) se řeší v samostatné změně pro nasazení.
