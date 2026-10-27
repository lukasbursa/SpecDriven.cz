## Context

Patička (`src/components/Footer.astro`) odkazuje na repozitář přes `site.repo.url` ze `src/site.config.ts`. Stejný soubor má i `repoTreeUrl()` pro odkazy do složek. Stránky článku a nástroje (`src/pages/clanky/[slug].astro`, `src/pages/nastroje/[slug].astro`) vykreslují obsah v `.prose`. Stránka nástroje za něj přidává generovanou sekci „Oficiální odkazy“. Glob loader Astra dává každé položce kolekce `filePath` relativně ke kořeni repozitáře, např. `src/content/tools/openspec.md`.

Omezení: `site-layout` zakazuje při načtení stránky stahovat cokoli z jiné domény. Zákaz JavaScriptu v prohlížeči byl zrušen, tento požadavek ale platí dál. Dekorativní prefixy `##` jsou jen v CSS, scoped styly patří do `@layer components` a mezeru před odkazem na novém řádku je potřeba psát jako `{' '}`.

## Goals / Non-Goals

**Goals:**
- Všechny adresy na GitHub se skládají na jednom místě (`site.config.ts`) z `site.repo`. Komponenty URL samy nepíšou.
- Chybně zapsaný odkaz na vlákno shodí build, nečeká se, až na něj někdo klikne.
- Blok zpětné vazby je jedna komponenta, kterou sdílí článek i nástroj.

**Non-Goals:**
- Kontrola, že Discussions a kategorie na GitHubu opravdu existují. Build by k tomu potřeboval síť a GitHub API, ověření je ruční úkol po nastavení.
- Workflow, které kontroluje pull requesty z forků. Nasazení spouští `check` a `build` před nahráním, rozbitý obsah se tedy na produkci nedostane. Kontrola PR může přijít samostatnou změnou.

## Decisions

### 1. Odkazy na GitHub místo vložené diskuze

Diskuze jsou jen odkazy. Vložené vlákno (Giscus a podobné) načítá skript a iframe z cizí domény, a to `site-layout` zakazuje. Načtení až po kliknutí by vyžadovalo změnit tento požadavek a přidat na web první JavaScript, to je na samostatnou změnu.

*Alternativa:* předvyplněné zakládání nového vlákna pro každý článek. GitHub pro nové vlákno nedokumentuje parametry URL a každý klik by založil další vlákno se stejným názvem. Místo toho autor vlákno založí ručně a odkaz zapíše do metadat (rozhodnutí 3).

### 2. Adresy v `site.config.ts`

```ts
export const site = {
  // …
  discussions: {
    url: 'https://github.com/lukasbursa/SpecDriven.cz/discussions',
    // Slug kategorie tvoří GitHub z názvu, doplní se po jejich založení.
    categories: { articles: '…/categories/<slug>', tools: '…/categories/<slug>' },
  },
} as const;

repoEditUrl(filePath)              // `${repo.url}/edit/${repo.branch}/${filePath}`
newIssueUrl(template, fields)      // `${repo.url}/issues/new?` + URLSearchParams({ template, ...fields })
```

`discussions.url` se odvodí z `site.repo.url`, URL kategorií se zapíšou ručně. GitHub ponechal ve slugu diakritiku (`…/categories/články`, `…/categories/nástroje`). V konfiguraci se slug zapíše čitelně a do `href` se dostane procentově zakódovaný přes `new URL(…).href` (`%C4%8Dl%C3%A1nky`), aby adresa nezávisela na tom, jak s ne-ASCII znaky naloží prohlížeč nebo RSS čtečka. `URLSearchParams` zakóduje mezery jako `+` a lomítka v adrese stránky. GitHub obojí přijímá.

### 3. Pole `discussion` v obou kolekcích

```ts
const discussion = z
  .url()
  .refine((url) => url.startsWith(`${site.discussions.url}/`), {
    message: `Odkaz na vlákno musí vést do ${site.discussions.url}/.`,
  })
  .optional();
```

Stejná definice se použije v `articles` i `tools`. Kontrola prefixu zachytí odkaz na cizí repozitář nebo překlep v doméně. Existenci vlákna nekontroluje. Komponenta pak použije `discussion ?? site.discussions.categories.<kolekce>`.

### 4. Komponenta `Feedback.astro`

Props: `discussion` (výsledná URL), `editUrl` a volitelně `report` (URL formuláře pro zastaralý údaj). Komponenta je samostatná `<section aria-labelledby>` za `.prose`, s nadpisem `<h2 class="mark-h2">Zpětná vazba</h2>`, takže prefix `##` dostane stejně jako sekce úvodní stránky. Obsah je seznam odkazů a pod ním věta, že odkazy vedou na GitHub a potřebují účet:

```
## Zpětná vazba
  Diskutovat na GitHubu →
  Navrhnout úpravu této stránky →
  Nahlásit zastaralý údaj →          (jen nástroj)
  Odkazy vedou na GitHub, kde je potřeba účet.
```

*Alternativa:* rozšířit `Frontmatter.astro` o odkazy. Blok metadat má oddělovače `---` a na konci stránky by působil jako druhý frontmatter. Navíc by se kvůli tomu měnil typ `Entry` sdílený článkem i nástrojem.

Šířka bloku je omezená stejně jako ostatní přímí potomci `.article`/`.tool` (`max-width: var(--measure)`). Ve sloupci na 320 px nic nepřetéká.

### 5. Formulář „Zastaralý údaj o nástroji“

`.github/ISSUE_TEMPLATE/zastaraly-udaj.yml` je issue form. Pole s `id` jde předvyplnit parametrem URL se stejným názvem:

| id | typ | povinné | předvyplní web |
|---|---|---|---|
| `nastroj` | input | ano | `title` nástroje |
| `stranka` | input | ano | absolutní URL stránky nástroje |
| `udaj` | textarea | ano | – |
| `zdroj` | input | ano | – |

Odkaz ze stránky: `newIssueUrl('zastaraly-udaj.yml', { title: 'Zastaralý údaj: <název>', nastroj: '<název>', stranka: '<URL>' })`. Štítky přidává šablona přes svůj klíč `labels`, ne parametr URL. Parametr `labels` by fungoval jen uživatelům s právy k repozitáři.

`navrh-obsahu.yml` má pole `typ` (dropdown Článek / Nástroj), `popis` a `zdroje`. `config.yml` nechává prázdná issue povolená a přidává odkaz „Dotazy a diskuze“ na Discussions.

### 6. Hranice pravidla pro příspěvky

| Smí přímý PR | Prochází OpenSpec |
|---|---|
| úprava textu a faktů v existujícím souboru v `src/content/` (fakt s odkazem na oficiální zdroj) | nový článek nebo nástroj (návrh začíná issue) |
| | cokoli mimo `src/content/`: komponenty, stránky, styly, schéma, konfigurace |

Pravidlo platí pro všechny včetně autora webu. Zapíše se třikrát, každé místo pro jiného čtenáře: sekce „Jak přispět“ na stránce „Jak vznikl tento web“ (čtenář webu), `CONTRIBUTING.md` (přispěvatel na GitHubu, GitHub na soubor odkazuje při zakládání issue a PR) a sekce Workflow v `CLAUDE.md` (agent pracující v repozitáři). Odkaz „Navrhnout úpravu“ tak vede na cestu, kterou pravidlo povoluje.

## Risks / Trade-offs

- [Discussions nejsou zapnuté nebo kategorie nemají očekávanou adresu → odkazy vrací 404] → nastavení GitHubu je první úkol a musí být hotové před pushem do `main`. GitHub vrací stav 200 i pro neexistující kategorii, proto se ověřuje, že stránka kategorie obsahuje její popis, ne stav odpovědi.
- [Šablony issue fungují až z výchozí větve] → formulář a předvyplnění se dají ověřit až po pushi do `main`, poslední úkol je ruční kontrola na produkci.
- [Editor `.mdx` souboru ukáže čtenáři importy a komponenty] → přijatelné. CONTRIBUTING.md vysvětlí, že text mezi komponentami jde upravit beze změny kódu.
- [K přispění je potřeba účet na GitHubu] → blok to říká přímo. Pro publikum webu (vývojáři) je to běžné.
- [Spam a nevhodné příspěvky] → moderace nástroji GitHubu (skrytí, zamčení, blokace). Web nic neukládá.

## Migration Plan

Pořadí nasazení: (1) autor zapne Discussions, založí kategorie Obecné, Články, Nástroje, Nápady a URL kategorií se zapíšou do `site.config.ts`, (2) push do `main` nasadí web i šablony issue, (3) ruční kontrola odkazů na produkci. Návrat je revert commitu. Discussions můžou zůstat zapnuté i bez odkazů z webu.
