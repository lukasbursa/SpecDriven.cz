## Context

Články jsou `.mdx` v `src/content/articles/`. Komponenty se do nich importují relativní cestou (`Scenario.astro` v úvodním článku) a odkazy do repozitáře skládají funkce `repoTreeUrl()` a `repoBlobUrl()` ze `src/site.config.ts`, které jde importovat i v MDX. Tabulky v článku `prose.css` posouvá vodorovně samostatně, takže obyčejná Markdown tabulka na úzké obrazovce stránku nerozbije.

Web má zatím jen věcné články. Tento bude první názorový (viz proposal.md, What Changes), proto většina rozhodnutí níže řeší, jak udržet ostřejší tón a přitom splnit požadavek, že fakta mají zdroj.

Příklad „stejná změna dvakrát“ stojí na archivované změně `2026-10-27-add-color-scheme-toggle`. Má jasné zadání, které se vejde do jedné věty promptu, a přitom devět scénářů (bliknutí při načtení, návrat k systému, chování bez JavaScriptu, klávesnice, mobil), které v takové větě nejsou.

## Goals / Non-Goals

**Goals:**
- Čtenář si z článku odnese rozhodovací pravidlo, ne jen dojem, že SDD je lepší.
- Provokace je v nadpisu, perexu a závěru. Tělo článku obstojí i před čtenářem, který si zdroje ověří.
- Příklad jde dohledat v repozitáři, nikdo ho nemusí brát na slovo.

**Non-Goals:**
- Vlastní pokus, při kterém by AI skutečně dostala jen prompt a výsledek by se porovnal se specifikací (viz rozhodnutí 4).
- Nová komponenta pro srovnání. `ComparisonTable.astro` je vázaná na kolekci `tools` a pro dva přístupy se nehodí.
- Diagramy jako obrázky nebo SVG.

## Decisions

### 1. Osnova článku

| # | Sekce | Bod požadavku |
|---|---|---|
| – | perex (pole `description`) | – |
| 1 | Co je vibe coding | vymezení pojmu se zdrojem |
| 2 | Kde vibe coding funguje | situace, kdy stačí |
| 3 | Kde se láme | situace, kdy naráží, a proč |
| 4 | Vibe coding vs. spec-driven development | srovnání v tabulce |
| 5 | Jedna změna dvakrát | co přinese specifikace, příklad |
| 6 | Co tím získáte | co přinese specifikace |
| 7 | Co to stojí | navíc nad požadavek |
| 8 | Kdy co | doporučení |
| – | závěr | – |

Sekce 7 v požadavku není, ale bez ní by článek působil jako reklama. Specifikace vyjmenovává povinné části, další jí neodporují. Sekce 8 obsahuje i hybridní cestu: prototyp vibe codingem, a když se nápad osvědčí, sepsat k němu specifikaci.

*Alternativa, kratší esej bez příkladu:* rychlejší na napsání, ale bez sekce 5 zůstane argument v obecné rovině a článek by se nelišil od desítek podobných textů.

### 2. Metadata

```yaml
title: Konec vibe codingu? Přichází spec-driven development
description: Vibe coding je rychlý start, ale u softwaru, který má dlouho vydržet, narazí. Srovnání se spec-driven developmentem a co vám specifikace přinese.
pubDate: <datum implementace>
tags: [názor]
```

Soubor `konec-vibe-codingu.mdx`. Perex má 145 znaků a vejde se do limitu 160. Termín se v celém článku píše „vibe coding“ odděleně, tak jak ho zavedl Karpathy, ve skloňování „vibe codingu“.

### 3. Zdroje: jen primární, ověřené v den psaní

| Tvrzení | Zdroj | V článku |
|---|---|---|
| Karpathy zavedl pojem, citát „forget that the code even exists“, vymezení na „throwaway weekend projects“ | jeho příspěvek na X z 2. 2. 2025 | povinně |
| Slovo roku 2025 | oznámení Collins Dictionary | povinně |
| Ne každé programování s AI je vibe coding | článek Simona Willisona z března 2025 | povinně |
| Zkušení vývojáři byli s AI pomalejší, ale připadali si rychlejší | studie METR z července 2025 | **nepoužije se** (viz níže) |

Výsledek ověření (27. 10. 2026):
- **Karpathy:** příspěvek <https://x.com/karpathy/status/1886192184808149383> z 2. 2. 2025 (23:17 UTC). X ho bez přihlášení nezobrazí, plné znění se ověřilo přes veřejné API zrcadla fxtwitter a shoduje se s citací u Willisona. Článek cituje „forget that the code even exists“, „I don't read the diffs anymore“, „The code grows beyond my usual comprehension“ a „It's not too bad for throwaway weekend projects“ a odkazuje na původní URL na X.
- **Collins:** oficiální stránka `collinsdictionary.com/woty` automatické načtení odmítá. Článek proto odkazuje na oznámení na jazykovém blogu Collins (<https://blog.collinsdictionary.com/language-lovers/collins-word-of-the-year-2025-ai-meets-authenticity-as-society-shifts/>, 6. 11. 2025), které vibe coding jako slovo roku 2025 uvádí.
- **Willison:** „Not all AI-assisted programming is vibe coding (but vibe coding rocks)“, <https://simonwillison.net/2025/Mar/19/vibe-coding/>, 19. 3. 2025. Vibe coding vymezuje jako „building software with an LLM without reviewing the code it writes“.
- **METR:** studie (<https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/>) zkoumala 16 vývojářů s nástroji z počátku roku 2025. Autoři dnes na stránce sami uvádějí, že výsledky „no longer reflect the current impact of AI models“, a odkazují na novější studii. Omezení se do jedné věty nevejdou, takže tvrzení by v článku z října 2026 zavádělo.

Citáty zůstanou v angličtině s českým překladem hned za nimi, aby šly porovnat s originálem. Studie METR se použije, jen když se její omezení (malý vzorek, zkušení vývojáři ve vlastních velkých projektech, nástroje z počátku roku 2025) vejdou do jedné věty u tvrzení. Jinak by článek tvrdil víc, než studie ukázala. Bezpečnostní reporty a mediální incidenty (agent smazal databázi apod.) se nepoužijí: metodika reportů je těžko ověřitelná a incidenty svádějí k senzaci.

Každý odkaz se otevře a ověří, než se do článku zapíše. Když primární zdroj nejde najít nebo říká něco jiného, tvrzení z článku vypadne (scénář „Fakta bez zdroje“).

### 4. Příklad: hypotetický prompt proti skutečné specifikaci

Vibe verze je jedna věta promptu („přidej do hlavičky přepínač tmavého režimu“). Článek **netvrdí**, co by AI vygenerovala. Ukazuje, co v té větě chybí: na co se agent nemá jak dozvědět, pokud to sám neodhadne. SDD verze je skutečná specifikace změny `add-color-scheme-toggle`. Dva její scénáře („Načtení bez bliknutí“, „Prohlížeč bez JavaScriptu“) se ukážou komponentou `Scenario` a celá změna se odkáže přes `repoTreeUrl('openspec/changes/archive/2026-10-27-add-color-scheme-toggle')`.

Seznam „co v promptu chybí“ se napíše jako obyčejný seznam, ne jako ASCII grafika.

*Alternativa, skutečný pokus s agentem:* byl by přesvědčivější, ale výsledek závisí na modelu a dni, nejde zopakovat a proposal ho dává mimo rozsah.

### 5. Žádné ASCII diagramy, rozhodování jako číslovaný seznam

Diagramy z kreslících znaků v bloku kódu čtečka obrazovky přečte znak po znaku a na úzké obrazovce se posouvají. Osa „kde žije zadání“ se proto vejde do tabulky v sekci 4 (první řádek). Rozhodovací strom v sekci 8 bude číslovaný seznam otázek („Zahodíte to do měsíce? Pak stačí vibe coding.“).

### 6. Srovnávací tabulka v Markdownu

Obyčejná Markdown tabulka s přístupy ve sloupcích a hledisky v řádcích (kde žije zadání, nové sezení s AI, proti čemu se ověřuje, co vidí reviewer, předání kolegovi, změna po půl roce, rychlost startu, režie u drobností). V posledních dvou řádcích vede vibe coding. Tabulka to tak říká rovnou a podpírá požadavek, že článek nesmí vibe coding odepsat.

### 7. Odkaz na sebe sama

Závěr uvede, že článek vznikl přes specifikaci, a odkáže na hlavní specifikaci `openspec/specs/articles/spec.md` přes `repoBlobUrl()`, ne na složku změny. Složka změny se při archivaci přesune a dostane datum do názvu, takže odkaz by se rozbil.

### 8. Odkaz z úvodního článku a pravidlo v `config.yaml`

V úvodním článku přibude na konec sekce „Proč se o SDD mluví právě teď“ jedna věta s odkazem. Do kontextu v `openspec/config.yaml` přibude za odstavec o tónu krátký odstavec: názorové články mají štítek `názor`, smí mít ostřejší formulace v nadpisu, perexu a závěru a fakta v nich odkazují na zdroj stejně jako jinde. Stejná věta přibude do sekce „Tón obsahu“ v `CONTRIBUTING.md`, aby pravidlo znali i přispěvatelé, kteří `config.yaml` nečtou.

## Risks / Trade-offs

- [Nadpis s „Konec…“ může působit jako clickbait a ubrat webu na důvěryhodnosti] → Otazník v titulku, férové sekce 2 a 7 a tabulka, ve které vibe coding dvakrát vede.
- [Karpathy nebo Willison mohli příspěvek smazat nebo upravit] → Ověřit v den psaní. Kdyby původní příspěvek zmizel, citovat přes archivovanou kopii a uvést to.
- [Specifikace mezi commitem implementace a archivací ještě požadavek tohoto článku neobsahuje, a odkaz ze závěru tak chvíli vede na specifikaci bez něj] → Archivovat ve stejném pushi jako implementaci, protože push do `main` nasazuje.
- [Štítek `názor` zatím nemá vlastní výpis a čtenář nemusí poznat, co znamená] → Článek to v textu zvlášť neuvádí (autor větu „Tento text je názorový…“ při revizi odmítl). Názorovost nese štítek a tón nadpisu. Výpis štítků je mimo rozsah.
- [Srovnání se časem rozejde s vývojem nástrojů] → Článek nevypisuje konkrétní nástroje pro vibe coding a o SDD nástrojích jen odkazuje na přehled a srovnání, kde mají data ověření.
