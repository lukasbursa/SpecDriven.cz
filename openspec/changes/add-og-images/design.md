## Context

Obrázek pro sdílení je dnes jeden statický soubor `public/og-default.png`. `SeoHead.astro` ho vypisuje v `og:image` na všech stránkách. Design `add-site-foundation` generování obrázků pro jednotlivé články výslovně vyřadil z rozsahu, tato změna ho otevírá.

Články a stránky nástrojů na webu píše Claude. Obrázek tedy může nakreslit ve stejném kroku jako SVG, tedy textový soubor, který jde verzovat, revidovat v pull requestu a opravit. Vykreslené PNG si umí prohlédnout a chyby v rozvržení opravit.

Před napsáním návrhu proběhl krátký pokus (spike) s převodem SVG na PNG v Node:

- `@resvg/resvg-js` 2.6.2 s `loadSystemFonts: false` a písmem IBM Plex Sans ve formátu WOFF nebo WOFF2 vrátil prázdný obrázek: text se nevykreslil vůbec.
- Se stejným písmem ve formátu TTF (oficiální soubor z repozitáře IBM Plex) se text „Příliš žluťoučký kůň“ vykreslil správně včetně všech diakritických znamének.
- Balíčky `@ibm/plex-sans` 1.1.0 a `@ibm/plex-mono` 2.5.0 na npm obsahují jen WOFF a WOFF2. Písmo, které stahuje Fonts API Astra, je WOFF2.

Motivaci popisuje proposal.md, požadavky jsou ve specifikaci změny.

## Goals / Non-Goals

**Goals:**
- Každý článek a nástroj má vlastní obrázek, který nakreslí Claude spolu s obsahem. Člověk na to nepotřebuje grafický program.
- Výsledné PNG nezávisí na stroji, který web sestavuje (písma, operační systém).
- Obrázky drží vizuální styl webu, i když každý kreslí jiná konverzace.

**Non-Goals:**
- Automatická kontrola, jestli se text vešel nebo se něco nepřekrývá. Na to slouží pohled na vykreslené PNG.
- Šablona, do které by build sám dosadil název. Uživatel zvolil obrázky, které kreslí Claude celé.
- Zveřejnění zdrojových SVG. Na webu je jen PNG.

## Decisions

### 1. SVG leží vedle obsahu a páruje se podle názvu souboru

`src/content/articles/<slug>.og.svg` patří k `src/content/articles/<slug>.mdx`, u nástrojů obdobně. Cesta se odvodí z `filePath` záznamu kolekce záměnou přípony za `.og.svg`. Loader kolekcí čte jen `*.{md,mdx}`, takže SVG mu nevadí.

Uvažované alternativy:

- **PNG v `public/og/`:** binární soubor v gitu, při změně názvu článku zastará a v revizi nejde vidět, co se změnilo.
- **Složka `src/assets/og/`:** obrázek by byl daleko od článku a při psaní článku by se na něj snáz zapomnělo.
- **Pole `ogImage` v metadatech:** opakovalo by informaci, kterou dává název souboru. Konvence stačí a nemůže ukazovat na neexistující soubor.

Úprava textu v existujícím `.og.svg` (například oprava názvu spolu s opravou článku) spadá pod výjimku z `CLAUDE.md` pro úpravy existujících souborů v `src/content/`. Pravidlo se tedy nemění, jen se to do `CLAUDE.md` dopíše.

### 2. Převod na PNG přes resvg při buildu

Statický endpoint `src/pages/og/[collection]/[slug].png.ts` má `getStaticPaths()` nad `getPublishedArticles()` (`collection: 'clanky'`) a `getPublishedTools()` (`collection: 'nastroje'`). Vrací jen záznamy, které mají SVG, takže koncepty a stránky bez obrázku se nevygenerují. `GET` vrátí PNG z `Resvg` s `font: { loadSystemFonts: false, fontFiles: [...4 TTF], defaultFontFamily: 'IBM Plex Sans' }`.

Endpoint funguje i v `npm run dev`. Obrázek jde při kreslení stáhnout z `http://localhost:4321/og/clanky/<slug>.png` a hned si ho prohlédnout bez celého buildu.

Uvažované alternativy:

- **`sharp`** je v projektu jako závislost Astra, ale SVG převádí přes librsvg, který bere písma ze systému přes fontconfig. Výsledek by závisel na stroji a IBM Plex na běžci GitHub Actions není.
- **`satori`** skládá obrázek z JSX šablony a text převádí na křivky. Hodí se pro šablonu s dosazeným názvem, ne pro obrázek, který kreslí Claude jako SVG.
- **Převod jednou při psaní článku a commit PNG:** viz rozhodnutí 1, binární soubor v gitu, který zastarává.

### 3. Písmo jako čtyři soubory TTF v repozitáři

`src/assets/fonts/og/` bude obsahovat `IBMPlexSans-Regular.ttf`, `IBMPlexSans-SemiBold.ttf`, `IBMPlexMono-Regular.ttf` a `IBMPlexMono-SemiBold.ttf` z oficiálního repozitáře IBM Plex (úplná znaková sada) a `OFL.txt`. Licence SIL Open Font License šíření dovoluje. Dohromady jde zhruba o 800 kB, které se nemění.

Uvažované alternativy:

- **Balíčky `@ibm/plex-*` z npm:** obsahují jen WOFF a WOFF2, a s těmi resvg text nevykreslí (spike).
- **TTF z Fontsource stahované při buildu:** Fontsource dělí písmo podle znakových sad (`latin`, `latin-ext`), takže na každou řez by byly potřeba dva soubory. Build by navíc závisel na další síťové službě.

Kurzíva ani jiné řezy se nepřidávají, pravidla kreslení je nepovolují.

### 4. Kontrola SVG před převodem

`src/lib/og-image.ts` zkontroluje zdrojový text SVG a při první chybě vyhodí výjimku s cestou k souboru a důvodem:

- kořenový `<svg>` má `width="1200"`, `height="630"` a `viewBox="0 0 1200 630"`,
- žádné `<script>`, `<foreignObject>`, atributy `on…=` ani `@import` a `@font-face`,
- každé `href` a `xlink:href` začíná `#` a každé `url(` pokračuje `#`, takže jsou povolené jen odkazy na prvky uvnitř souboru (přechody, masky, `<use>`),
- každé `font-family` v atributech i ve stylech je `IBM Plex Sans` nebo `IBM Plex Mono` (s uvozovkami nebo bez),
- převod přes resvg proběhne bez chyby.

Kontrola je založená na regulárních výrazech, bez parseru XML. Je konzervativní: neobvyklý, ale neškodný zápis může build shodit, a pak se SVG zapíše jinak. Nejde o bezpečnostní hranici, protože SVG se nikdy nezveřejní a do prohlížeče jde jen PNG. Kontrola chrání před chybami, které by vedly k jinému vzhledu, než jaký Claude viděl: chybějící písmo, nenačtený obrázek nebo špatný ořez.

Varování o stránkách bez obrázku vypíše `getStaticPaths()` endpointu přes `console.warn`, jednou za build a s výčtem slugů.

### 5. Napojení na stránky

`src/lib/og-image.ts` exportuje `ogImagePath(entry)`, které vrátí `/og/clanky/<slug>.png` nebo `/og/nastroje/<slug>.png`, když SVG existuje, jinak `undefined`. Stránka článku a nástroje výsledek předá do `SeoHead` v novém propu `image`, jehož výchozí hodnota je `site.ogImage`. `SeoHead` z něj složí absolutní adresu pro `og:image` a vypíše `og:image:alt` s názvem stránky (u úvodní stránky `site.name`). `og:image:width` a `og:image:height` zůstávají 1200 a 630, rozměr hlídá kontrola z rozhodnutí 4.

Pokud už bude implementovaná změna `add-seo-metadata`, dostane stejnou adresu i `image` ve strukturovaných datech článku a nástroje.

### 6. Pravidla kreslení: šablona a `CLAUDE.md`

`src/assets/og-template.svg` obsahuje pevné prvky, které mají všechny obrázky stejné a které vycházejí z `og-default.png`: pozadí „papír“ `#fafaf7` s mřížkou, logo a nápis „SpecDriven.cz“ vlevo nahoře a modrý pruh dole. Dál vyznačuje prázdné oblasti pro štítek, název a motiv. Šablona se nepublikuje.

Pravidla v `CLAUDE.md` (sekce „Obrázky pro sdílení“):

- Začni kopií šablony, pevné prvky neměň.
- **Štítek:** IBM Plex Mono 400, 28 px, barva `#46525f`, text podle cesty na stránce (`clanky / <slug>`, `nastroje / <slug>`). Když je slug delší než zhruba 40 znaků, jen `clanky` nebo `nastroje`.
- **Název:** IBM Plex Sans 600, 64 px (nejméně 52 px), barva `#14202e`, nejvýš 3 řádky zalomené ručně přes `<tspan>`, protože SVG text nezalamuje. Levý okraj 80 px.
- **Motiv:** jeden diagram ze slovníku specifikací, který souvisí s obsahem. Například blok WHEN/THEN, delta s řádky `+`/`−`, strom složky změny, cyklus Záměr → Specifikace → Plán → Implementace → Ověření, blok frontmatteru nebo výřez tabulky. U nástroje charakteristický prvek jeho postupu (příkazy, struktura složek), nikdy jeho logo, protože to je ochranná známka. Text v motivu má nejméně 24 px.
- **Barvy** jen ze světlého režimu webu: `#fafaf7`, `#ffffff`, `#14202e`, `#46525f`, `#5f6b7a`, `#dce3ea`, `#1f5fbf`, `#eaf1fc` a pro delty `#1e6b3a` a `#a3202a`.
- **Tvary** ploché, tahy 2 px, zaoblení 8 px. Žádné fotografie, lidé ani výrazné přechody. Vzhled se zapisuje atributy (`fill`, `font-size`), ne v `<style>`, protože resvg podporuje CSS jen částečně.
- **Kontrola:** vykresli PNG (dev server nebo build), prohlédni si ho a oprav text, který přetéká nebo se překrývá. Teprve potom je obrázek hotový.

Do kontextu v `openspec/config.yaml` se pravidla nekopírují. Kontext dostává každé generování artefaktů a pravidla kreslení se týkají jen implementace. Do `config.yaml` přibude pravidlo pro artefakt `tasks`: když změna přidává článek nebo nástroj nebo mění jeho název, úkoly MUST obsahovat nakreslení nebo úpravu obrázku podle `CLAUDE.md` a kontrolu vykresleného PNG.

### 7. Obrázky pro dnešní obsah

V rámci změny vzniknou obrázky pro všechny publikované články (`co-je-spec-driven-development`, `srovnani-nastroju` a `konec-vibe-codingu`, pokud bude v tu dobu publikovaný) a všech šest nástrojů. Každý se kreslí a kontroluje samostatně podle rozhodnutí 6. Po dokončení build nevypíše žádné varování o chybějícím obrázku.

## Risks / Trade-offs

- **[Text přetéká nebo se překrývá]** SVG nezalamuje a kontrola rozvržení není automatická. → Povinná kontrola vykresleného PNG (rozhodnutí 6). Pravidlo v `config.yaml` ji dostane do každé změny s novým obsahem.
- **[Obrázky se stylem rozcházejí]** Každý kreslí jiná konverzace. → Pevné prvky ze šablony, omezená paleta a velikosti písma. Při revizi změny je obrázek vidět jako PNG v náhledu i jako text SVG.
- **[Nativní binárka resvg na běžci]** `@resvg/resvg-js` instaluje předkompilovanou binárku podle platformy. → Pro `linux-x64-gnu` (GitHub Actions) i `darwin-arm64` existuje. Kdyby instalace selhala, náhradou je `@resvg/resvg-wasm` se stejným API pro vykreslení.
- **[Repozitář naroste o písma]** Zhruba 800 kB jednorázově. → Přijatelné, soubory se nemění.
- **[Sociální sítě drží starý náhled v cache]** LinkedIn a Facebook si náhled ukládají. → Po nasazení obnovit náhled u hlavních stránek v LinkedIn Post Inspector, případně v Sharing Debuggeru od Facebooku.
- **[Čtvercový ořez]** Některé aplikace (WhatsApp, malé náhledy ve Slacku) obrázek ořízne na čtverec uprostřed a z názvu u levého okraje zbude jen část. → Přijatelné. Hlavní místo pro sdílení je LinkedIn s plným poměrem 1,91 : 1 a název je v náhledu i jako text.
- **[Přispěvatel bez Clauda obrázek nenakreslí]** → Obrázek je nepovinný, stránka použije výchozí obrázek a build na to upozorní. `CONTRIBUTING.md` uvede, že obrázek doplní správce.

## Migration Plan

1. Implementovat a ověřit `npm run check` a `npm run build` (bez varování o chybějících obrázcích) a výstup v `dist/og/`.
2. Push do `main` web nasadí, nové PNG se nahrají s ostatními soubory.
3. Po nasazení zkontrolovat náhled úvodního článku a jednoho nástroje v LinkedIn Post Inspector.

Návrat zpět: revert commitu a push. Stránky se vrátí k `og-default.png`.
