## Purpose

Stránky nástrojů pro spec-driven development: co o každém nástroji web uvádí, jak je nástroje řadí a kde je čtenář najde. Údaje o nástrojích se rychle mění, proto každá stránka nese datum ověření a odkazy na oficiální zdroje.

## ADDED Requirements

### Requirement: Povinná metadata nástroje
Každý nástroj MUST mít název, popis (nejvýše 160 znaků), typ, licenci, datum publikace a datum ověření údajů. Typ MUST být jeden z těchto: „CLI“, „IDE“, „Plugin“, „Metodika“, „Platforma“. Nástroj SHALL mít volitelně odkaz na oficiální web, odkaz na veřejný repozitář zdrojového kódu, odkaz na dokumentaci, počet hvězd repozitáře na GitHubu, datum aktualizace a příznak konceptu. Nástroj MUST mít alespoň jeden z odkazů na oficiální web a na repozitář. Počet hvězd MUST být uveden jen u nástroje s odkazem na repozitář. Nástroj, který tato pravidla porušuje, MUST způsobit selhání sestavení webu s chybovou hláškou, která nástroj identifikuje.

#### Scenario: Chybějící datum ověření
- **WHEN** autor přidá nástroj bez data ověření a spustí sestavení webu
- **THEN** sestavení selže a chybová hláška uvede soubor nástroje a chybějící pole

#### Scenario: Nástroj bez oficiálního odkazu
- **WHEN** nástroj nemá odkaz na oficiální web ani na repozitář
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj

#### Scenario: Hvězdy bez repozitáře
- **WHEN** nástroj má uvedený počet hvězd, ale nemá odkaz na repozitář
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj

#### Scenario: Neznámý typ
- **WHEN** typ nástroje není žádný z povolených
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj a povolené typy

### Requirement: Řazení podle popularity
Všude, kde web vypisuje více nástrojů, SHALL je řadit podle počtu hvězd na GitHubu od nejvyššího. Nástroje bez uvedeného počtu hvězd SHALL následovat až za všemi nástroji s hvězdami. Nástroje se stejným počtem hvězd a nástroje bez hvězd SHALL být mezi sebou seřazeny abecedně podle názvu.

#### Scenario: Pořadí podle hvězd
- **WHEN** Spec Kit má 143 024 hvězd a OpenSpec 73 062 hvězd
- **THEN** Spec Kit je ve výpisu před OpenSpec

#### Scenario: Komerční nástroje na konci
- **WHEN** Kiro nemá uvedený počet hvězd a Agent OS má 5 548 hvězd
- **THEN** výpis končí v pořadí Agent OS, Kiro

### Requirement: Přehled nástrojů
Web SHALL mít stránku `/nastroje/` s hlavním nadpisem „Nástroje pro spec-driven development“ a krátkým úvodem, který uvede, podle čeho jsou nástroje seřazeny. Stránka SHALL vypsat všechny publikované nástroje. U každého SHALL být zobrazen název (odkaz na stránku nástroje), typ, popis, počet hvězd ve formátu běžném v češtině (např. „143 024“), případně text, že nástroj nemá veřejný repozitář, a datum ověření.

#### Scenario: Zobrazení přehledu
- **WHEN** čtenář otevře `/nastroje/`
- **THEN** vidí všechny publikované nástroje seřazené podle popularity, každý s názvem, typem, popisem, počtem hvězd a datem ověření

#### Scenario: Přehled na mobilu
- **WHEN** čtenář otevře `/nastroje/` na šířce 320 px
- **THEN** všechny údaje o nástrojích jsou čitelné bez vodorovného posouvání stránky

### Requirement: Stránka nástroje
Každý publikovaný nástroj SHALL mít vlastní stránku na adrese `/nastroje/<slug>/`, kde `<slug>` je odvozen z názvu souboru nástroje. Stránka SHALL zobrazit název nástroje jako hlavní nadpis, blok metadat (typ, licence, počet hvězd, datum ověření, datum publikace a případné datum aktualizace) a obsah. Obsah MUST obsahovat sekci „Jak funguje“, která přiřadí kroky nebo příkazy nástroje k obecnému cyklu SDD (Záměr, Specifikace, Plán, Implementace, Ověření). Na konci stránky SHALL být sekce „Oficiální odkazy“ se všemi odkazy z metadat nástroje (web, repozitář, dokumentace). Nástroj bez sekce „Jak funguje“ MUST způsobit selhání sestavení webu.

#### Scenario: Otevření stránky nástroje
- **WHEN** čtenář otevře `/nastroje/openspec/`
- **THEN** zobrazí se stránka s nadpisem „OpenSpec“, blokem metadat s datem ověření, sekcí „Jak funguje“ a sekcí „Oficiální odkazy“

#### Scenario: Odkazy z metadat
- **WHEN** nástroj má v metadatech odkaz na oficiální web a na repozitář
- **THEN** oba odkazy jsou v sekci „Oficiální odkazy“ na stránce nástroje

#### Scenario: Chybějící sekce Jak funguje
- **WHEN** autor přidá nástroj, jehož obsah nemá sekci „Jak funguje“, a spustí sestavení webu
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj

### Requirement: Koncepty nástrojů se nepublikují
Nástroj označený jako koncept MUST být vynechán z přehledu nástrojů, z úvodní stránky, z RSS feedu i ze sitemap a MUST NOT mít v produkčním sestavení vlastní stránku.

#### Scenario: Koncept nástroje v produkci
- **WHEN** autor označí nástroj jako koncept a sestaví produkční verzi webu
- **THEN** výstup sestavení neobsahuje stránku tohoto nástroje ani odkaz na ni

### Requirement: Nástroje nejsou články
Stránky nástrojů MUST NOT být zobrazeny v seznamu článků `/clanky/` ani ve výpisu nejnovějších článků na úvodní stránce.

#### Scenario: Seznam článků bez nástrojů
- **WHEN** čtenář otevře `/clanky/`
- **THEN** seznam neobsahuje žádnou stránku nástroje

### Requirement: Pokryté nástroje
Web SHALL obsahovat publikované stránky těchto nástrojů: Spec Kit (`/nastroje/spec-kit/`), OpenSpec (`/nastroje/openspec/`), BMAD-METHOD (`/nastroje/bmad-method/`), GSD Core (`/nastroje/gsd-core/`), Agent OS (`/nastroje/agent-os/`) a Kiro (`/nastroje/kiro/`). Údaje na nich MUST vycházet z oficiálních zdrojů nástroje platných k datu ověření.

#### Scenario: První dávka nástrojů
- **WHEN** čtenář otevře `/nastroje/`
- **THEN** přehled obsahuje Spec Kit, OpenSpec, BMAD-METHOD, GSD Core, Agent OS a Kiro
