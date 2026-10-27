## Context

Nástroje jsou v kolekci `tools`. Jediným vstupem je `getPublishedTools()` v `src/lib/tools.ts`, která vynechá koncepty (i na vývojovém serveru) a seřadí nástroje podle hvězd. Každá stránka nástroje má sekci „Jak funguje“ s tabulkou *Obecný krok → V nástroji* a stejnou osnovu (Co to je, Soubory v repozitáři, Instalace, Podporovaná prostředí, Kdy se hodí). Všech šest nástrojů bylo ověřeno 27. 10. 2026.

Články jsou `.md`/`.mdx` v `src/content/articles/` a komponenty se do nich importují relativní cestou, stejně jako `Scenario.astro` v úvodním článku. `prose.css` dnes všem tabulkám v článku nastavuje `display: block; overflow-x: auto`, takže posouvaná je samotná tabulka. Obsah článku je široký nejvýše `--measure` (68ch) a zarovnaný vlevo v kontejneru `--container` (1080 px). Scoped styly komponent jsou ve vrstvě `components`, která přebije vrstvu `prose`.

## Goals / Non-Goals

**Goals:**
- Údaje, které už jsou v metadatech nástroje, se do článku nepřepisují.
- Úplnost srovnání hlídá build stejně jako povinnou sekci „Jak funguje“, ne revize.
- Široká tabulka jde číst na 320 px i klávesnicí, bez JavaScriptu.

**Non-Goals:**
- Řazení a filtrování tabulek v prohlížeči.
- Strukturovaná pole pro kvalitativní údaje ve schématu `tools` (viz rozhodnutí 1).
- Kontrola úplnosti textu mimo tabulky (úvod, tři přístupy, otázky k výběru).
- Automatické hlídání, jestli kvalitativní údaje v článku nezastaraly vůči novějšímu datu ověření nástroje (viz Risks).

## Decisions

### 1. Hybrid: metadata z kolekce, ostatní údaje v článku

Typ, licence, hvězdy a datum ověření čte komponenta z `tool.data`. Všechno ostatní (soubory, příkazy, formát požadavků…) zapisuje autor v MDX článku, přímo u tabulky, ke které patří.

*Alternativa A, vše ručně v MDX:* hvězdy a licence by byly na dvou místech a při další aktualizaci stránky nástroje by se rozešly.
*Alternativa C, nová pole ve schématu `tools`* (`specFormat`, `verification`…): hodnoty jsou spíš krátké věty než data. Schéma by narostlo o pole, která potřebuje jediný článek, a autor stránky nástroje by musel psát stejnou věc dvakrát, jednou do textu a jednou do metadat.

### 2. Komponenta `ComparisonTable.astro`, nástroje vždy v řádcích

```ts
type MetaField = 'kind' | 'license' | 'stars' | 'verifiedDate';

type Column =
  | { meta: MetaField }                              // hodnota z tool.data
  | { label: string; values: Record<string, string> }; // klíč = slug nástroje

interface Props {
  caption: string;   // název tabulky, např. „Cyklus krok za krokem“
  columns: Column[];
}
```

```mdx
import ComparisonTable from '../../components/ComparisonTable.astro';

<ComparisonTable
  caption="Cyklus krok za krokem"
  columns={[
    { label: 'Záměr', values: { 'spec-kit': '`constitution.md`', openspec: '`proposal.md`', … } },
    …
  ]}
/>
```

- Řádky a jejich pořadí určuje `getPublishedTools()`. Autor pořadí nepíše, takže platí požadavek „Řazení podle popularity“ ze specifikace `tools`.
- První sloupec je `<th scope="row">` s názvem nástroje jako odkazem na `toolPath(tool)`. Záhlaví sloupců jsou `<th scope="col">`, první se jmenuje „Nástroj“.
- Popisky sloupců z metadat jsou pevné a odpovídají klíčům bloku metadat stránky nástroje, jen s velkým písmenem jako ruční sloupce: „Typ“, „Licence“, „Hvězdy“, „Ověřeno“. Hvězdy formátuje `formatStars()`. U nástroje bez hvězd se zobrazí „bez veřejného repozitáře“ jako na stránce nástroje. Datum se formátuje přes `formatDateShort()` v prvku `<time>`.
- Jedna orientace pro všechny tabulky znamená jednu kontrolu úplnosti a jedno pravidlo pro přichycený sloupec. Řádek se čte jako „jak tímto nástrojem projde změna“ a sloupec jako „jak stejný krok dělají ostatní“.

*Alternativa:* tabulka s cyklem s nástroji ve sloupcích (kroky v řádcích). Šířka by byla stejná, ale vznikly by dvě orientace a kontrola úplnosti by se musela psát dvakrát.

*Alternativa:* Markdownové tabulky a přichycený sloupec v `prose.css`. Úplnost by pak nešla zkontrolovat a styl by se změnil i u dvousloupcových tabulek na stránkách nástrojů.

### 3. Kontrola úplnosti při buildu

Komponenta před vykreslením projde každý ruční sloupec:

| Situace | Výsledek |
|---|---|
| publikovaný nástroj nemá klíč ve `values`, nebo má prázdný řetězec | `throw` |
| klíč ve `values` není slug žádného nástroje v kolekci | `throw` |
| klíč patří konceptu | hodnota se ignoruje |

Hlášky (`<stránka>` je `Astro.url.pathname`):

```
Srovnání „Cyklus krok za krokem“ (/clanky/srovnani-nastroju/): sloupec „Záměr“ nemá hodnotu pro nástroj tessl.
Srovnání „Cyklus krok za krokem“ (/clanky/srovnani-nastroju/): sloupec „Záměr“ uvádí neznámý nástroj spec-kitt.
```

Koncepty se při kontrole neznámých klíčů považují za známé. Autor tak může srovnání doplnit už během psaní konceptu nástroje a build mezitím projde. Kontrola potřebuje slugy všech nástrojů včetně konceptů, proto přibude `getToolIds()` v `src/lib/tools.ts`. Přístup ke kolekci tak zůstane v jednom modulu a publikované nástroje se dál vybírají jen přes `getPublishedTools()`.

*Alternativa:* neznámé klíče tiše ignorovat. Překlep ve slugu nebo přejmenovaný soubor nástroje by pak způsobil jen „chybějící hodnotu“ a hláška by mířila jinam, než je chyba.

### 4. Hodnoty buněk: text a `kód`

Hodnota je obyčejný řetězec, protože Markdown v props komponenty nefunguje. Komponenta rozdělí text podle zpětných apostrofů a liché úseky vykreslí jako `<code>`. Nic dalšího nepodporuje: žádné odkazy, tučné písmo ani HTML. Text se vypisuje přes běžný výraz Astra, takže se escapuje. Odkazy na oficiální zdroje patří do textu kolem tabulky nebo na stránku nástroje.

### 5. Rozvržení a přístupnost

```
<div class="comparison" role="region" tabindex="0" aria-labelledby="<id caption>">
  <table>
    <caption id="…" class="visually-hidden">Cyklus krok za krokem</caption>
    …
```

- `<caption>` je vizuálně skrytý. Každá tabulka stojí hned pod nadpisem sekce se stejným textem, viditelný název by se opakoval. Čtečky ho oznámí jako název tabulky i posouvané oblasti.
- Komponenta ve vrstvě `components` přepíše pro svou tabulku `display: block` z `prose.css` zpět na `display: table`. Posouvá se obal `.comparison`, ne tabulka. Přichycený sloupec (`position: sticky; left: 0`) se vztahuje k nejbližšímu posouvanému předkovi, takže tabulka sama posouvaná být nesmí.
- Buňky prvního sloupce mají pozadí `--bg` a pravý okraj `--line`, aby přes ně neprosvítal posouvaný obsah. Tokeny `light-dark()` tím řeší i tmavý režim.
- `tabindex="0"` a `role="region"` s názvem z `<caption>` umožní posouvat šipkami a čtečka oblast pojmenuje (pravidlo axe `scrollable-region-focusable`). Zaměření ukazuje stejný `:focus-visible` obrys jako odkazy.
- Šířka: na širokých obrazovkách obal přesáhne `--measure` doprava až do šířky obsahu stránky článku. Tabulka se šesti krátkými sloupci se pak na desktopu vejde bez posouvání. Na úzkých obrazovkách je obal široký jako sloupec textu a posouvá se. Šířku obsahu zná CSS přes container query: element `.article` na stránce článku dostane `container-type: inline-size` a obal má `width: 100cqi`. Výraz `100vw` by se nehodil, protože započítává i posuvník stránky a tabulka by na některých šířkách přetekla. Bez kontejneru (komponenta mimo stránku článku) se `cqi` vztahuje k viewportu. Úkol 2.2 to ověří v prohlížeči.
- Buňky mají `min-width` kolem 8rem, aby se texty nelámaly po slovech, a písmo `--text-sm`. Tabulka cyklu (šest sloupců) se tak vejde do kontejneru 1080 px.

### 6. Tři přístupy bez diagramu

Rozdíl „co se stane se specifikací“ popíše článek ve třech krátkých odstavcích (živá specifikace systému, specifikace jedné funkce, požadavky produktu nebo milníku). Zařazení každého nástroje je zároveň sloupec „Po dokončení práce“ v tabulce „Jak vypadá specifikace“. Kontrola úplnosti tak hlídá i tuto část a článek nepotřebuje obrázek, který by bylo nutné kreslit pro oba barevné režimy a popsat alternativním textem.

*Alternativa:* ASCII diagram v bloku kódu. Čtečky by ho přečetly jako změť znaků a na 320 px by se posouval.

### 7. Osnova článku

Soubor `src/content/articles/srovnani-nastroju.mdx`, štítek `nástroje`. Údaje se čerpají z ověřených stránek nástrojů. Nová tvrzení je potřeba ověřit v oficiální dokumentaci.

| Sekce | Tabulka a sloupce (`*` = z metadat) | Zdroj na stránce nástroje |
|---|---|---|
| (perex) | – | k jakému datu údaje platí, odkazy na stránky nástrojů, zmínka, že web vzniká v OpenSpec |
| Přehled | typ\*, licence\*, Potřebuje, hvězdy\*, ověřeno\* | Instalace |
| Tři přístupy ke specifikaci | – (tři odstavce) | Co to je, Soubory v repozitáři |
| Cyklus krok za krokem | Záměr, Specifikace, Plán, Implementace, Ověření (jen názvy souborů a příkazů) | Jak funguje |
| Jak vypadá specifikace | Kde leží, Formát požadavků, Po dokončení práce | Soubory v repozitáři, Co to je |
| Ověření | Jak se ověřuje, Proti čemu | Jak funguje |
| Malé změny | Zkratka pro malé změny | Jak funguje, Kdy se hodí |
| Podporovaná prostředí | Prostředí, Nativní formát | Podporovaná prostředí |
| Podle čeho vybírat | – (seznam otázek, u každé nástroje podle jejich dokumentace) | Kdy se hodí |

Pod tabulkou „Jak vypadá specifikace“ bude jeden požadavek zapsaný třemi způsoby: v EARS (Kiro), jako scénář WHEN/THEN (OpenSpec) a jako Given/When/Then (Spec Kit). Jako základ poslouží příklad z dokumentace Kira („formulář s neplatnými daty“). Text uvede, že další dva zápisy jsou ilustrace webu podle dokumentovaného formátu, ne citace.

Otázky k výběru jsou formulované jako situace („Chcete editor, agenta a specifikaci v jednom produktu?“) s odkazem na nástroje, jejichž dokumentace tuto situaci uvádí. Nepoužijí komponentu `Scenario`, protože ta na webu ukazuje zápis specifikace a jako rozhodovací pomůcka by mátla.

### 8. Odkazy na srovnání z nástrojů

- `src/lib/articles.ts` dostane `getComparisonArticle()`, která vrátí publikovaný článek se slugem `srovnani-nastroju`, nebo `undefined`. Slug je zapsaný jen tady. Když je článek koncept, funkce vrátí `undefined` a odkazy zmizí, takže nevznikne odkaz na neexistující stránku.
- `/nastroje/`: na konec úvodního odstavce přibude věta s odkazem, např. „Rozdíly mezi nimi vedle sebe ukazuje [Srovnání nástrojů](/clanky/srovnani-nastroju/).“
- Stránka nástroje: šablona vloží za `<Content />` a před nadpis „Oficiální odkazy“ odstavec „Jak se <název> liší od ostatních nástrojů, ukazuje [Srovnání nástrojů pro spec-driven development](…).“ Je uvnitř `.prose`, takže dostane běžný styl textu.

## Risks / Trade-offs

- [Kvalitativní údaje v článku zastarají, když se aktualizuje stránka nástroje] → perex uvádí, k jakému datu údaje platí, a přehled ukazuje datum ověření každého nástroje. `CLAUDE.md` dostane pravidlo, že změna údajů o nástroji kontroluje i srovnání. Automatické porovnání `verifiedDate` s datem článku by shodilo build při každém přepočtu hvězd, i když se nic podstatného nezměnilo.
- [Každý nový nástroj vyžaduje doplnit šest tabulek] → je to záměr: srovnání má být úplné. Koncepty build nehlídá, takže doplnění může vzniknout postupně během psaní nástroje.
- [Hodnoty v props jsou hůř čitelné než Markdownová tabulka] → hodnoty jsou krátké (názvy souborů a příkazů, krátké fráze), každý sloupec je jeden objekt s klíči podle slugů a chybu v klíči odhalí build.
- [Přesah tabulky mimo sloupec textu může na některé šířce rozbít rozvržení] → záložní varianta bez přesahu, viz rozhodnutí 5.
- [Šest posouvaných tabulek pod sebou je na telefonu náročné na čtení] → v tabulce cyklu jen názvy souborů a příkazů, vysvětlení v textu a na stránkách nástrojů.

## Migration Plan

Žádná migrace dat. Nová adresa `/clanky/srovnani-nastroju/` žádnou existující nenahrazuje. Nasazení proběhne běžným pushem do `main`, návrat revertem commitu.

## Open Questions

- Mají Spec Kit nebo Kiro mechanismus, který specifikace jednotlivých funkcí slučuje do souhrnné specifikace systému? Stránky nástrojů to neuvádějí. Odpověď určí jen zařazení nástrojů v sekci „Tři přístupy“ a ve sloupci „Po dokončení práce“, ne strukturu článku ani komponentu. Ověří ji úkol 4.1.
  *Odpověď (27. 10. 2026):* ne. Spec Kit podle [dokumentace](https://github.github.io/spec-kit/concepts/sdd.html) nepředepisuje, jak se mají soubory funkce uchovávat nebo upravovat po změně požadavků. Kiro má jednu složku na funkci v `.kiro/specs/` a specifikace podle [doporučených postupů](https://kiro.dev/docs/specs/best-practices/) průběžně upravuje, slučování ale nepopisuje. Oba nástroje proto patří do skupiny „specifikace funkce“.
