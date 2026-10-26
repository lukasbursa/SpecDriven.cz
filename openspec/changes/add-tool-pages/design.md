## Context

Web má jednu content collection `articles` a jediné místo, kde se vybírají publikované články (`getPublishedArticles()` v `src/lib/articles.ts`). Stránka článku `src/pages/clanky/[slug].astro` vykresluje blok metadat ve stylu YAML frontmatteru (`<dl class="frontmatter">` s oddělovači `---`), styly má scoped v sobě. Úvodní stránka skládá sekce přímo v `src/pages/index.astro`. Schéma používá `z` z `astro/zod` (Zod 4), neplatná metadata shodí build s hláškou, která uvede soubor.

Omezení: data se formátují v UTC (`src/lib/dates.ts`), dekorativní prefixy `##` jsou jen v CSS a scoped styly patří do `@layer components`.

## Goals / Non-Goals

**Goals:**
- Nástroje mají vlastní kolekci se schématem, ve kterém jsou povinná pole opravdu povinná, a jedno místo, kde se filtrují koncepty a určuje pořadí.
- Povinné části stránky nástroje hlídá build, ne jen revize.
- Údaje o nástroji (odkazy, hvězdy, datum ověření) jsou zapsané jednou, ve frontmatteru, a stránka, karta i přehled je čtou odtud.

**Non-Goals:**
- Stahování počtu hvězd z GitHub API při buildu (viz rozhodnutí 3).
- Společný typ „obsah“ pro články a nástroje. Sdílí jen RSS, abstrakce nad dvěma kolekcemi by se nevyplatila.
- Vlastní obrázky (loga) nástrojů. Loga jsou chráněné značky a karta se obejde bez nich.

## Decisions

### 1. Samostatná kolekce `tools`

Nástroje jsou v `src/content/tools/<slug>.md` (nebo `.mdx`), nová kolekce `tools` v `src/content.config.ts`:

```ts
const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z
    .object({
      title: z.string().min(1),                 // název nástroje
      description: z.string().min(1).max(160),
      kind: z.enum(['CLI', 'IDE', 'Plugin', 'Metodika', 'Platforma']),
      license: z.string().min(1),                // „MIT“, „komerční“…
      website: z.url().optional(),
      repository: z.url().optional(),
      docs: z.url().optional(),
      stars: z.number().int().nonnegative().optional(),
      verifiedDate: z.coerce.date(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    })
    .refine((t) => t.website || t.repository, { message: 'Nástroj potřebuje website nebo repository.' })
    .refine((t) => t.stars === undefined || t.repository, { message: 'Pole stars vyžaduje repository.' }),
});
```

Typ se ukládá rovnou jako zobrazovaný český štítek, takže odpadá převodní tabulka. Pole `title` (ne `name`) drží konvenci kolekce `articles` a `SeoHead`.

*Alternativa:* volitelný objekt `tool` v kolekci `articles`. Stránky nástrojů ale nejsou v `/clanky/` ani mezi nejnovějšími a mají vlastní URL. Každý výpis článků by je musel odfiltrovat a schéma by nemohlo pole vynutit. Samostatná kolekce oddělí obojí bez filtrování.

### 2. `src/lib/tools.ts` jako jediný vstup

Stejný vzor jako `articles.ts`:

- `getPublishedTools()` vrací nástroje bez konceptů v pořadí podle popularity: `stars` sestupně, nástroje bez `stars` na konci, při shodě abecedně podle `title` (`localeCompare` s `cs`). Používá ji úvodní stránka, `/nastroje/`, `getStaticPaths` stránky nástroje i RSS.
- `toolPath(tool)` vrací `/nastroje/<id>/`.
- `formatStars(n)` vrací číslo přes `Intl.NumberFormat('cs-CZ')`, tedy „143 024“ s nezlomitelnou mezerou.

### 3. Hvězdy se zapisují ručně spolu s datem ověření

Počet hvězd je hodnota ve frontmatteru, kterou autor aktualizuje při ověření údajů (např. `curl https://api.github.com/repos/<owner>/<repo>`). Pořadí se tak mění jen vědomou změnou v gitu a odpovídá zobrazenému datu ověření.

*Alternativa:* stahovat hvězdy při buildu. Build by závisel na dostupnosti a limitech GitHub API (60 požadavků za hodinu bez tokenu) a pořadí by se měnilo bez commitu. Číslo by navíc neodpovídalo datu ověření ostatních údajů.

### 4. Povinná sekce „Jak funguje“ hlídaná při buildu

`render(entry)` vrací kromě `Content` i seznam nadpisů. Stránka nástroje v `getStaticPaths` (nebo pomocná funkce v `tools.ts`) ověří, že mezi nadpisy úrovně 2 je „Jak funguje“, a jinak vyhodí chybu `Nástroj <id>: chybí sekce „Jak funguje“`. Build tak selže stejně jako u neplatných metadat.

Sekci „Oficiální odkazy“ autor nepíše. Šablona ji vykreslí za obsahem z polí `website`, `repository` a `docs`, takže odkaz nikdy nechybí a nezastará jinak než metadata. Je uvnitř `.prose`, nadpis tedy dostane stejný prefix `##` jako ostatní.

### 5. Stránky a komponenty

```
src/pages/nastroje/index.astro     přehled, BaseLayout title „Nástroje pro spec-driven development“
src/pages/nastroje/[slug].astro    stránka nástroje, type="article", publishedTime, modifiedTime
src/components/ToolCards.astro     mřížka karet; prop limit a příznak pro datum ověření
src/components/Frontmatter.astro   blok metadat ve stylu YAML (vyjmutý z clanky/[slug].astro)
```

- **Karty** (`ToolCards.astro`) slouží úvodní stránce (6 karet, bez data ověření) i přehledu (všechny, s datem ověření). Karta obsahuje název jako `<h3>` s odkazem, štítek typu, popis a řádek v monospace `hvězdy: 143 024`, u nástroje bez repozitáře `bez veřejného repozitáře`. Mřížka je stejná jako u cyklu (`repeat(auto-fit, minmax(…, 1fr))`), na 320 px tedy karty jdou pod sebe. Hvězdu jako znak (★) nepoužíváme, protože ji IBM Plex nemá a prohlížeč by sáhl po náhradním písmu.
- **Blok metadat** se vyjme do `Frontmatter.astro` (prop: pole dvojic klíč a hodnota), aby ho stránka článku i stránka nástroje sdílely i se styly. Stránka článku se tím vizuálně nezmění. Klíče u nástroje: `typ`, `licence`, `hvězdy`, `ověřeno`, `publikováno`, `aktualizováno`.
- **Cesta** nad nadpisem: `nastroje / <slug>`, stejně jako `clanky / <slug>`.
- **Úvodní stránka**: nová sekce `aria-labelledby="nastroje"` s nadpisem `mark-h2` a odkazem `Všechny nástroje →` ve stejném `section__head` jako u nejnovějších článků.
- **Navigace**: do pole `nav` v `Header.astro` přibude `{ href: '/nastroje/', label: 'Nástroje' }` mezi „Články“ a „Jak vznikl tento web“. Funkce `current()` pak sama zvýrazní i stránky nástrojů.

### 6. RSS

`rss.xml.ts` načte `getPublishedArticles()` i `getPublishedTools()`, převede obojí na položky (odkaz přes `articlePath` a `toolPath`, `categories` u nástrojů `['nástroje']`) a seřadí podle `pubDate` sestupně. Název feedu se změní z „SpecDriven.cz – články“ na „SpecDriven.cz“, protože už neobsahuje jen články.

### 7. Osnova stránky nástroje

Povinné je jen to, co hlídá build (rozhodnutí 4). Kvůli srovnatelnosti mají stránky tuto osnovu a sekce, které se pro nástroj nehodí, se vynechají:

| Sekce | Obsah |
|---|---|
| (perex) | 1–2 věty navazující na `description`: co nástroj je a kdo za ním stojí |
| Co to je | myšlenka nástroje, v čem se liší pojetí specifikace |
| **Jak funguje** | tabulka *Obecný krok → V nástroji* (Záměr, Specifikace, Plán, Implementace, Ověření), pod ní krátký popis průchodu jednou změnou |
| Soubory v repozitáři | strom složek a krátká ukázka specifikace nebo jiného artefaktu |
| Instalace | minimální příkazy pro začátek podle oficiální dokumentace |
| Podporovaná prostředí | AI asistenti, IDE, operační systémy |
| Kdy se hodí | typické nasazení a známá omezení podle oficiálních zdrojů a dokumentace |
| Oficiální odkazy | generuje šablona |

Typy a zdroje první dávky (hvězdy ověřené 27. 10. 2026, před zápisem znovu ověřit):

| Nástroj | Soubor | Typ | Web | Repozitář | Hvězdy |
|---|---|---|---|---|---|
| Spec Kit | `spec-kit.md` | CLI | github.github.com/spec-kit | github/spec-kit | 143 024 |
| OpenSpec | `openspec.md` | CLI | openspec.dev | Fission-AI/OpenSpec | 73 062 |
| BMAD-METHOD | `bmad-method.md` | Metodika | – (ověřit) | bmad-code-org/BMAD-METHOD | 54 588 |
| Agent OS | `agent-os.md` | Plugin | buildermethods.com/agent-os | buildermethods/agent-os | 5 548 |
| GSD Core | `gsd-core.md` | Plugin | opengsd.net | open-gsd/gsd-core | 10 889 |
| Kiro | `kiro.md` | IDE | kiro.dev | – | – |

Repozitář `kirodotdev/Kiro` je jen issue tracker, ne zdrojový kód IDE, proto se jako `repository` neuvádí a Kiro nemá hvězdy. Licence BMAD-METHOD hlásí GitHub jako `NOASSERTION`, skutečnou je potřeba vyčíst ze souboru LICENSE.

U OpenSpec stránka uvede, že jím vzniká tento web, s odkazem na „Jak vznikl tento web“.

## Risks / Trade-offs

- [Údaje zastarají, hlavně hvězdy a podporovaná prostředí] → datum ověření je vidět na stránce, v bloku metadat i v přehledu. Aktualizace je změna frontmatteru a textu, nic víc.
- [Řazení podle hvězd znevýhodňuje komerční nástroje] → je to vědomé rozhodnutí. Přehled v úvodu říká, podle čeho se řadí, a karta ukazuje „bez veřejného repozitáře“ místo nuly.
- [Hvězdy jsou různě staré, pokud se nástroje ověřují v různé dny] → u každého nástroje je jeho vlastní datum ověření. Při přidání nového nástroje je vhodné přepočítat hvězdy všech.
- [Kontrola nadpisu „Jak funguje“ podle textu se rozbije přejmenováním] → chybová hláška uvede přesný očekávaný text.
- [Vyjmutí `Frontmatter.astro` změní stránku článku] → po buildu porovnat HTML stránky úvodního článku před a po (stejné prvky a třídy).

## Migration Plan

Žádná migrace dat. Nasazení proběhne běžným pushem do `main`. Nové adresy `/nastroje/…` žádnou existující nenahrazují, takže není potřeba přesměrování. Návrat je revert commitu.
