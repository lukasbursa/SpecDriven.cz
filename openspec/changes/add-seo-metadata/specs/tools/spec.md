## MODIFIED Requirements

### Requirement: Stránka nástroje
Každý publikovaný nástroj SHALL mít vlastní stránku na adrese `/nastroje/<slug>/`, kde `<slug>` je odvozen z názvu souboru nástroje. Stránka SHALL zobrazit název nástroje jako hlavní nadpis, blok metadat (typ, licence, počet hvězd, datum ověření, datum publikace, případné datum aktualizace a autor stránky) a obsah. Autorem je autor webu z nastavení webu. Obsah MUST obsahovat sekci „Jak funguje“, která přiřadí kroky nebo příkazy nástroje k obecnému cyklu SDD (Záměr, Specifikace, Plán, Implementace, Ověření). Na konci stránky SHALL být sekce „Oficiální odkazy“ se všemi odkazy z metadat nástroje (web, repozitář, dokumentace). Nástroj bez sekce „Jak funguje“ MUST způsobit selhání sestavení webu.

#### Scenario: Otevření stránky nástroje
- **WHEN** čtenář otevře `/nastroje/openspec/`
- **THEN** zobrazí se stránka s nadpisem „OpenSpec“, blokem metadat s datem ověření, sekcí „Jak funguje“ a sekcí „Oficiální odkazy“

#### Scenario: Odkazy z metadat
- **WHEN** nástroj má v metadatech odkaz na oficiální web a na repozitář
- **THEN** oba odkazy jsou v sekci „Oficiální odkazy“ na stránce nástroje

#### Scenario: Chybějící sekce Jak funguje
- **WHEN** autor přidá nástroj, jehož obsah nemá sekci „Jak funguje“, a spustí sestavení webu
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj

#### Scenario: Autor stránky nástroje
- **WHEN** čtenář otevře `/nastroje/openspec/`
- **THEN** blok metadat obsahuje řádek `autor:` se jménem Lukáš Burša
