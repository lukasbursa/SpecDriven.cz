# Jak přispět do SpecDriven.cz

Web se vyvíjí metodou spec-driven developmentu: změna chování webu nejdřív dostane návrh a specifikaci, teprve potom kód. U oprav obsahu by to byla zbytečná byrokracie, proto je cesta příspěvku podle toho, co měníte.

| Co chcete udělat | Jak |
|---|---|
| Opravit překlep, formulaci nebo fakt v existujícím článku či stránce nástroje | Rovnou pull request. Opravu faktu doložte odkazem na oficiální zdroj. |
| Upozornit na zastaralý údaj o nástroji, ale neopravovat ho sami | [Issue „Zastaralý údaj o nástroji“](https://github.com/lukasbursa/SpecDriven.cz/issues/new?template=zastaraly-udaj.yml) |
| Navrhnout nový článek nebo nástroj | [Issue „Návrh článku nebo nástroje“](https://github.com/lukasbursa/SpecDriven.cz/issues/new?template=navrh-obsahu.yml). Po domluvě vznikne změna v OpenSpec. |
| Změnit chování, strukturu nebo vzhled webu | Změna v OpenSpec, viz níže. |
| Zeptat se nebo se podělit o zkušenost | [Diskuze](https://github.com/lukasbursa/SpecDriven.cz/discussions) |

Hranice je jednoduchá: přímý pull request smí upravit jen existující soubory v [`src/content/`](src/content/). Cokoli jiného (komponenty, stránky, styly, schéma obsahu, konfigurace) nebo nový soubor obsahu jde přes OpenSpec. Platí to pro všechny, včetně autora webu.

## Oprava obsahu

Články jsou v [`src/content/articles/`](src/content/articles/), stránky nástrojů v [`src/content/tools/`](src/content/tools/). Nejrychlejší cesta je odkaz „Navrhnout úpravu“ na konci každé stránky webu: GitHub otevře editor souboru a sám připraví fork i pull request.

Některé články jsou v MDX (`.mdx`). Na začátku mají řádky `import …` a v textu komponenty jako `<Scenario …>`. Ty nechte, jak jsou, a upravujte jen text mezi nimi. Metadata na začátku souboru (mezi `---`) kontroluje build, neplatná hodnota ho shodí.

U stránky nástroje, kde opravujete fakt, aktualizujte i `verifiedDate` na den, kdy jste údaj ověřili.

Vedle článku nebo nástroje může ležet obrázek pro sdílení `<slug>.og.svg`. Když měníte název, upravte ho v obrázku taky, nebo to nechte na správci. U nového obsahu je obrázek nepovinný: bez něj se použije výchozí obrázek webu a správce ho doplní.

## Změna přes OpenSpec

Popis metody a cyklu propose → apply → archive je na stránce [Jak vznikl tento web](https://specdriven.cz/jak-vznikl-tento-web/), dokumentace nástroje na [openspec.dev](https://openspec.dev/).

1. Založte změnu příkazem `openspec new change <název>` a vyplňte návrh, specifikace, design a úkoly ve složce `openspec/changes/<název>/`. Artefakty se píšou česky, strukturní nadpisy (`### Requirement:`, `#### Scenario:`) a klíčová slova SHALL/MUST anglicky.
2. Zkontrolujte je: `openspec validate <název> --strict`.
3. Pošlete pull request jen s návrhem změny. Kód přijde na řadu, až bude návrh domluvený.
4. Implementace ověřuje chování proti scénářům WHEN/THEN ve specifikaci. Musí projít `npm run check` a `npm run build`.

Aktuální specifikace webu jsou v [`openspec/specs/`](openspec/specs/), kontext projektu (publikum, tón, stack) v [`openspec/config.yaml`](openspec/config.yaml).

## Tón obsahu

Obsah je věcný a informativní: vysvětluje, co nástroj nebo pojem je a jak funguje. Fakta o nástrojích odkazují na oficiální zdroje a nesou datum ověření, protože se rychle mění. Obsah je česky, s diakritikou.

Výjimkou jsou názorové články. Mají štítek `názor` a smí mít ostřejší formulace v nadpisu, perexu a závěru. Fakta v nich odkazují na zdroj stejně jako jinde.
