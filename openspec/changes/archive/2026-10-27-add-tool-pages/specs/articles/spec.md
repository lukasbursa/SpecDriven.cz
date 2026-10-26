## MODIFIED Requirements

### Requirement: RSS feed
Web SHALL poskytovat RSS feed na adrese `/rss.xml`, který obsahuje publikované články i publikované stránky nástrojů (viz capability `tools`), seřazené podle data publikace od nejnovějšího, s názvem, popisem, datem a absolutním odkazem každé položky. Každá stránka SHALL v hlavičce dokumentu odkazovat na tento feed.

#### Scenario: Odběr přes RSS čtečku
- **WHEN** RSS čtečka načte `/rss.xml`
- **THEN** obdrží platný RSS 2.0 dokument se všemi publikovanými články a stránkami nástrojů

#### Scenario: Odkaz na stránku nástroje v RSS
- **WHEN** RSS feed obsahuje položku nástroje OpenSpec
- **THEN** odkaz položky je `https://specdriven.cz/nastroje/openspec/`

### Requirement: Úvodní článek
Web SHALL obsahovat publikovaný článek „Co je spec-driven development“ na adrese `/clanky/co-je-spec-driven-development/`, který vysvětluje princip SDD, jeho obecný cyklus (záměr, specifikace, plán, implementace, ověření) a roli specifikace při práci s AI asistenty. Nástroje SHALL článek uvést jako příklady s odkazem na jejich stránky na webu a na přehled `/nastroje/`.

#### Scenario: Úvodní článek existuje
- **WHEN** čtenář otevře `/clanky/co-je-spec-driven-development/`
- **THEN** zobrazí se publikovaný článek s vysvětlením SDD

#### Scenario: Odkazy na nástroje
- **WHEN** čtenář v úvodním článku klikne na název nástroje
- **THEN** zobrazí se stránka tohoto nástroje na webu
