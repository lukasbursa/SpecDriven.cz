## Why

Web má šest stránek nástrojů se stejnou osnovou, ale čtenář, který se rozhoduje mezi nimi, je musí otevřít jednu po druhé a rozdíly si skládat sám. Nejdůležitější rozdíl přitom z jednotlivých stránek skoro nejde vyčíst: co se stane se specifikací po dokončení práce (průběžně udržovaná specifikace systému, nebo složka jedné funkce, nebo požadavky produktu). Srovnání vedle sebe ten rozdíl ukáže a údaje, které už web ověřil, využije znovu.

## What Changes

- Nový článek „Srovnání nástrojů pro spec-driven development“ na `/clanky/srovnani-nastroju/` se sekcemi: Přehled, Tři přístupy ke specifikaci, Cyklus krok za krokem, Jak vypadá specifikace, Ověření, Malé změny, Podporovaná prostředí, Podle čeho vybírat.
- Srovnávací tabulky, ve kterých má každý publikovaný nástroj jeden řádek. Typ, licence, hvězdy a datum ověření se berou z metadat nástroje, takže se po úpravě stránky nástroje ve srovnání změní samy. Ostatní údaje píše autor do článku.
- Úplnost hlídá build: když ve srovnávací tabulce chybí údaj pro publikovaný nástroj nebo je v ní nástroj, který na webu neexistuje, sestavení selže. Koncepty nástrojů se nepočítají.
- Tabulky jdou číst na telefonu: první sloupec s názvem nástroje zůstává při vodorovném posouvání vidět a posouvat jde i klávesnicí.
- Přehled `/nastroje/` a stránka každého nástroje odkazují na srovnání.
- Srovnání nevyhlašuje nejlepší nástroj. Sekce o výběru staví na otázkách a na tom, k čemu nástroj určuje jeho vlastní dokumentace. Článek uvádí, že web vzniká v OpenSpec.

Mimo rozsah: hodnocení nebo vlastní testy nástrojů, interaktivní filtrování a řazení tabulek, nové nástroje, odkaz na srovnání z úvodního článku a z úvodní stránky.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `articles`: nové požadavky na článek se srovnáním nástrojů, na úplnost srovnávacích tabulek a na jejich čitelnost a ovládání.
- `tools`: nový požadavek, aby přehled nástrojů a stránky nástrojů odkazovaly na srovnání.

## Impact

- Nový článek `src/content/articles/srovnani-nastroju.mdx` a nová komponenta `src/components/ComparisonTable.astro`.
- Úpravy `src/lib/tools.ts` a `src/lib/articles.ts` (pomocné funkce pro kontrolu úplnosti a vyhledání článku se srovnáním), `src/pages/nastroje/index.astro` a `src/pages/nastroje/[slug].astro` (odkazy na srovnání).
- Obsah vychází z údajů na stránkách nástrojů ověřených 27. 10. 2026. Tvrzení, která na nich nejsou (hlavně jestli Spec Kit nebo Kiro slučují specifikace funkcí do celku), je potřeba ověřit v oficiální dokumentaci.
- Přidání dalšího nástroje bude nově vyžadovat i doplnění srovnání. `CLAUDE.md` to musí uvádět.
- Žádné nové závislosti a v prohlížeči dál neběží JavaScript.
