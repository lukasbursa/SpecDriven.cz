## Why

„Vibe coding“ je dnes nejznámější pojem pro programování s AI a čtenáři, kteří na web přijdou, ho znají dřív než spec-driven development. Web zatím nemá článek, který by oba přístupy postavil vedle sebe a vysvětlil, kde vibe coding přestává stačit a co do takové situace přináší specifikace. Úvodní článek to naznačuje jen jednou větou o ztrátě kontextu mezi konverzacemi.

## What Changes

- Nový článek „Konec vibe codingu? Přichází spec-driven development“ na `/clanky/konec-vibe-codingu/`. Srovnává vibe coding se spec-driven developmentem a ukazuje, co člověk se specifikací získá. Obsah:
  - co je vibe coding podle toho, jak pojem zavedl Andrej Karpathy, s odkazem na původní zdroj,
  - kde vibe coding funguje (prototypy, jednorázové skripty, vlastní hračky),
  - kde naráží: ztráta záměru mezi sezeními, chybí měřítko pro ověření, review bez záměru, předávání práce v týmu, kód, který nikdo nečetl,
  - srovnání obou přístupů vedle sebe v tabulce,
  - co přinese specifikace a jak vypadá stejná změna oběma způsoby, s příkladem z repozitáře tohoto webu,
  - kdy zvolit který přístup.
- Článek je **názorový** a smí mít ostřejší formulace, hlavně v nadpisu, perexu a závěru. Má štítek `názor`. Fakta v něm (definice pojmu, studie, údaje o nástrojích) dál odkazují na zdroj. Titulek je otázka, protože článek netvrdí, že vibe coding zmizel, ale ukazuje, kde přestává stačit.
- Do `openspec/config.yaml` přibude pravidlo pro názorové články: jsou označené štítkem `názor`, smějí mít ostřejší tón a fakta v nich mají zdroj.
- Úvodní článek „Co je spec-driven development“ odkáže na nový článek ze sekce „Proč se o SDD mluví právě teď“.

Mimo rozsah: nové komponenty, změny šablony článku, vlastní měření nebo experimenty, hodnocení konkrétních nástrojů pro vibe coding (Lovable, Bolt a podobné) a zvláštní výpis nebo stránka pro štítek `názor`.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `articles`: nový požadavek na článek srovnávající vibe coding se spec-driven developmentem, včetně pravidel pro názorový článek a odkazu z úvodního článku.

## Impact

- Nový soubor `src/content/articles/konec-vibe-codingu.mdx` a odkaz v `src/content/articles/co-je-spec-driven-development.mdx`.
- Úprava kontextu v `openspec/config.yaml` (pravidlo pro názorové články). Kontext se předává při generování všech dalších artefaktů.
- Fakta je před publikací potřeba ověřit u zdroje, hlavně původní Karpathyho příspěvek (únor 2025) a jeho přesné znění, případné další studie nebo reporty, které článek cituje, a jejich metodiku.
- Žádný nový kód, závislosti ani JavaScript. Článek se objeví ve výpisu `/clanky/`, na úvodní stránce mezi nejnovějšími a v RSS přes `getPublishedArticles()`.
