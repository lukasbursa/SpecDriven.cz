## Purpose

Publikace článků o spec-driven developmentu: jejich povinná metadata, seznam, stránka detailu, práce s koncepty a RSS feed pro odběratele.

## ADDED Requirements

### Requirement: Povinná metadata článku
Každý článek MUST mít název, popis (nejvýše 160 znaků), datum publikace a SHALL mít volitelně datum aktualizace, seznam štítků a příznak konceptu. Článek s chybějícími nebo neplatnými povinnými metadaty MUST způsobit selhání sestavení webu s chybovou hláškou, která článek identifikuje.

#### Scenario: Chybějící popis
- **WHEN** autor přidá článek bez popisu a spustí sestavení webu
- **THEN** sestavení selže a chybová hláška uvede soubor článku a chybějící pole

#### Scenario: Příliš dlouhý popis
- **WHEN** popis článku má více než 160 znaků
- **THEN** sestavení selže s chybovou hláškou uvádějící článek

### Requirement: Seznam článků
Web SHALL mít stránku `/clanky/` se seznamem všech publikovaných článků seřazených od nejnovějšího. U každého článku SHALL být zobrazen název (odkaz na detail), datum publikace, popis a štítky.

#### Scenario: Zobrazení seznamu
- **WHEN** čtenář otevře `/clanky/`
- **THEN** vidí všechny publikované články seřazené podle data publikace od nejnovějšího

### Requirement: Detail článku
Každý publikovaný článek SHALL mít vlastní stránku na adrese `/clanky/<slug>/`, kde `<slug>` je odvozen z názvu souboru článku. Stránka SHALL zobrazit název, datum publikace, případné datum aktualizace, štítky a obsah článku.

#### Scenario: Otevření článku
- **WHEN** čtenář otevře `/clanky/co-je-spec-driven-development/`
- **THEN** zobrazí se článek s jeho názvem jako hlavním nadpisem a datem publikace

#### Scenario: Aktualizovaný článek
- **WHEN** článek má vyplněné datum aktualizace
- **THEN** na stránce článku je kromě data publikace uvedeno i „Aktualizováno“ s tímto datem

### Requirement: Koncepty se nepublikují
Článek označený jako koncept MUST být vynechán ze seznamu článků, z úvodní stránky, z RSS feedu i ze sitemap a MUST NOT mít v produkčním sestavení vlastní stránku.

#### Scenario: Koncept v produkci
- **WHEN** autor označí článek jako koncept a sestaví produkční verzi webu
- **THEN** výstup sestavení neobsahuje stránku tohoto článku ani odkaz na něj

### Requirement: RSS feed
Web SHALL poskytovat RSS feed publikovaných článků na adrese `/rss.xml` s názvem, popisem, datem a absolutním odkazem každého článku. Každá stránka SHALL v hlavičce dokumentu odkazovat na tento feed.

#### Scenario: Odběr přes RSS čtečku
- **WHEN** RSS čtečka načte `/rss.xml`
- **THEN** obdrží platný RSS 2.0 dokument se všemi publikovanými články

### Requirement: Úvodní článek
Web SHALL obsahovat publikovaný článek „Co je spec-driven development“ na adrese `/clanky/co-je-spec-driven-development/`, který vysvětluje princip SDD, jeho obecný cyklus (záměr, specifikace, plán, implementace, ověření) a roli specifikace při práci s AI asistenty. Článek MUST být neutrální: nástroje (OpenSpec, Spec Kit, Kiro) smí pouze vyjmenovat jako příklady s odkazem na oficiální zdroje, bez hodnocení a doporučení.

#### Scenario: Úvodní článek existuje
- **WHEN** čtenář otevře `/clanky/co-je-spec-driven-development/`
- **THEN** zobrazí se publikovaný článek s vysvětlením SDD
