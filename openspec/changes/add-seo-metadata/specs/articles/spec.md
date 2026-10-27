## MODIFIED Requirements

### Requirement: Detail článku
Každý publikovaný článek SHALL mít vlastní stránku na adrese `/clanky/<slug>/`, kde `<slug>` je odvozen z názvu souboru článku. Stránka SHALL zobrazit název, datum publikace, případné datum aktualizace, autora, štítky a obsah článku. Autorem je autor webu z nastavení webu.

#### Scenario: Otevření článku
- **WHEN** čtenář otevře `/clanky/co-je-spec-driven-development/`
- **THEN** zobrazí se článek s jeho názvem jako hlavním nadpisem a datem publikace

#### Scenario: Aktualizovaný článek
- **WHEN** článek má vyplněné datum aktualizace
- **THEN** na stránce článku je kromě data publikace uvedeno i „Aktualizováno“ s tímto datem

#### Scenario: Autor článku
- **WHEN** čtenář otevře `/clanky/co-je-spec-driven-development/`
- **THEN** blok metadat nad nadpisem obsahuje řádek `autor:` se jménem Lukáš Burša
