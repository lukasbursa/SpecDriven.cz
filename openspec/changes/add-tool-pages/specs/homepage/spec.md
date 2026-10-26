## ADDED Requirements

### Requirement: Sekce nástrojů
Úvodní stránka SHALL mezi cyklem SDD a nejnovějšími články zobrazit sekci „Nástroje pro SDD“ s kartami nejvýše šesti publikovaných nástrojů v pořadí podle popularity (viz capability `tools`) a s odkazem „Všechny nástroje →“, který vede na `/nastroje/`. Každá karta SHALL obsahovat název nástroje jako odkaz na jeho stránku, typ, popis a počet hvězd, případně text, že nástroj nemá veřejný repozitář.

#### Scenario: Výpis nástrojů
- **WHEN** na webu je publikováno osm nástrojů
- **THEN** sekce „Nástroje pro SDD“ zobrazí šest nejpopulárnějších a odkaz „Všechny nástroje →“

#### Scenario: Přechod na stránku nástroje
- **WHEN** čtenář klikne na název nástroje na kartě
- **THEN** zobrazí se stránka tohoto nástroje

#### Scenario: Karty na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px
- **THEN** karty nástrojů jsou pod sebou ve správném pořadí a čitelné bez vodorovného posouvání
