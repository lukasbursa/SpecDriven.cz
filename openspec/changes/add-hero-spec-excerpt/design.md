## Context

Úvodní sekce v `src/pages/index.astro` je sloupec flexboxu: popisek `## Purpose`, nadpis (`--text-hero`, nejvýše 3,75rem), úvodní text a `Scenario.astro` (nejvýše 40rem). Kontejner má nejvýše 1080 px. Požadavek „Výzva ve tvaru scénáře“ chce scénář viditelný bez posouvání na 1280×800.

Čtení z `openspec/` při sestavení už web má: `src/lib/openspec-status.ts` čte přes `node:fs` z `process.cwd()`. `src/site.config.ts` skládá odkazy do repozitáře (`repoTreeUrl()`, `repoEditUrl()`), odkaz na konkrétní řádky souboru zatím chybí.

## Goals / Non-Goals

**Goals:**
- Úryvek nemůže tiše zastarat: text i čísla řádků vznikají ze souboru při každém sestavení a chybějící požadavek shodí build.
- Úryvek je čitelný jako zdrojový soubor a zároveň srozumitelný pro čtečku obrazovky.
- Bez JavaScriptu v prohlížeči a bez nové závislosti.

**Non-Goals:**
- Obecný renderer Markdownu nebo zvýrazňovač syntaxe pro jiné soubory.
- Ukázka jiného požadavku na jiné stránce. Komponenta to umožní, ale nikde jinde se nepoužije.

## Decisions

### 1. Ukázat requirement „Vysvětlení SDD na první pohled“

Popisuje přesně to, co čtenář vidí v levém sloupci (nadpis a úvodní text), a je krátký: dvě věty a jeden scénář, v souboru řádky 9–14.

*Alternativa, „Výzva ve tvaru scénáře“:* text „WHEN nevíte, co je…“ je vlevo doslova, ale požadavek má tři scénáře a do sloupce by se nevešel celý. Zkrácený úryvek s výpustkou už není „skutečný“.

### 2. Zdrojový text, ne vykreslený Markdown

Úryvek vypadá jako soubor v editoru: titulek s cestou, čísla řádků, písmo Mono, zachované `###`, `####`, `- **WHEN**`. Tím se jasně liší od scénáře vlevo, který je rozhraním webu, ne ukázkou.

*Alternativa, vykreslit přes `Scenario.astro`:* v úvodní sekci by byly dva skoro stejné bloky a nebylo by poznat, který je výzva a který ukázka.

### 3. Výřez a zvýraznění při sestavení

Modul `src/lib/spec-excerpt.ts`:

```ts
interface ExcerptLine {
  number: number;     // číslo řádku v souboru, od 1
  tokens: Token[];
}
type Token = { text: string; kind: 'text' | 'marker' | 'heading' | 'keyword' | 'normative' };

function readRequirement(file: string, name: string): { file: string; lines: ExcerptLine[] };
```

- Soubor se čte z `process.cwd()` jako v `openspec-status.ts`. Výřez začíná řádkem `### Requirement: <name>` a končí před dalším řádkem začínajícím `### ` nebo `## `, nebo koncem souboru. Prázdné řádky na konci se oříznou.
- Když řádek s požadavkem chybí, funkce vyhodí chybu s názvem požadavku a cestou k souboru. Sestavení tak selže stejně jako u chybějící sekce „## Jak funguje“ nebo neúplné srovnávací tabulky.
- Tokeny: `#`/`##`/`###`/`####` s mezerou a odrážka `- ` jsou `marker`. Text nadpisu za nimi je `heading`. `**WHEN**`/`**THEN**`/`**GIVEN**`/`**AND**` se rozdělí na `marker` (`**`) a `keyword`. Samostatná slova `SHALL`/`MUST` jsou `normative`. Zbytek je `text`.
- Zvýraznění je vlastní, ne Shiki. Shiki je v Astru k dispozici, ale barvy bere z vlastních témat a do tokenů `light-dark()` by se musel přemapovat. Pět druhů tokenů se napíše na pár řádků.

### 4. Markup a přístupnost

```html
<figure class="spec-excerpt" aria-label="Ukázka specifikace úvodní stránky">
  <figcaption>openspec/specs/homepage/spec.md</figcaption>
  <code class="spec-excerpt__code">
    <span class="line"><span class="ln" aria-hidden="true">9</span><span>…tokeny…</span></span>
    …
  </code>
  <a href="…/blob/main/openspec/specs/homepage/spec.md#L9-L14">Celá specifikace na GitHubu →</a>
</figure>
```

- Tokeny `marker` a čísla řádků mají `aria-hidden="true"`, takže čtečka přečte „Requirement: Vysvětlení SDD na první pohled“ a „WHEN čtenář otevře…“ bez „mřížka mřížka“ a hvězdiček.
- `<figure>` dostane jméno přes `aria-label`, protože Chrome ho z `<figcaption>` neodvozuje (stejný důvod jako u `Scenario.astro`). Titulek s cestou zůstává viditelný.
- Místo `<pre>` je `<code>` s řádky jako bloky. Každý řádek je mřížka `auto minmax(0, 1fr)`: číslo vlevo a text, který se zalamuje (`white-space: pre-wrap`) s odsazením pod začátkem textu, ne pod číslem.
- Text se vypisuje výrazy Astra, ne přes `set:html`, takže se escapuje automaticky.

### 5. Odkaz na řádky v repozitáři

Do `src/site.config.ts` přibude `repoBlobUrl(path, lines?)`, který vrací `…/blob/main/<path>#L<od>-L<do>`. Čísla řádků jsou ze stejného výřezu jako úryvek. Na produkci se nasazuje každý push do `main`, takže řádky v odkazu odpovídají nasazenému webu.

### 6. Rozvržení

- Od šířky 64rem je `.hero__inner` mřížka `minmax(0, 1fr) minmax(0, 26rem)` s mezerou `--space-7`. Levý sloupec obsahuje dosavadní obsah beze změny pořadí, úryvek je v pravém sloupci zarovnaný nahoru (`align-self: start`).
- Pod 64rem zůstane sloupec a úryvek bude až za scénářem. Pořadí v DOM odpovídá pořadí čtení: nejdřív výzva, potom ukázka.
- Pozadí úryvku je `--surface`, rámeček `--line` a zaoblení `--radius` jako u scénáře, takže sedí v obou režimech. Styly jsou v `@layer components`.

*Alternativa pro mobil, skrýt úryvek:* hlavička by zůstala kratší, ale nápad by na telefonu zmizel. *Alternativa `<details>`:* bez JavaScriptu nejde mít úryvek na počítači otevřený a na mobilu zavřený, leda vykreslit ho dvakrát.

## Risks / Trade-offs

- [Užší levý sloupec zalomí nadpis „Nejdřív specifikace.“ do dvou řádků a scénář se posune níž] → Při 1280 px má levý sloupec asi 620 px. Ověřit na 1280×800. Když se nadpis zalomí, zúžit pravý sloupec na 24rem, nebo začít dva sloupce až od větší šířky.
- [Požadavek se časem prodlouží a úryvek přeroste levý sloupec] → Výška úvodní sekce poroste, ale scénář vlevo zůstane na místě. Při úpravě požadavku zkontrolovat úvodní stránku. Build to nehlídá.
- [Někdo požadavek přejmenuje a nečeká, že tím shodí build] → Chyba uvádí název i soubor, `CLAUDE.md` vazbu popisuje.
- [Na 320 px je úryvek dlouhý blok písma Mono před sekcí „Jak SDD funguje“] → Přijatelné, obsah je krátký (asi 20 zalomených řádků). Alternativy výše mají horší poměr cena/užitek.
