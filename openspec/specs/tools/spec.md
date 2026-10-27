# tools Specification

## Purpose

Stránky nástrojů pro spec-driven development: co o každém nástroji web uvádí, jak je nástroje řadí a kde je čtenář najde. Údaje o nástrojích se rychle mění, proto každá stránka nese datum ověření a odkazy na oficiální zdroje.

## Requirements

### Requirement: Povinná metadata nástroje
Každý nástroj MUST mít název, popis (nejvýše 160 znaků), typ, licenci, datum publikace a datum ověření údajů. Typ MUST být jeden z těchto: „CLI“, „IDE“, „Plugin“, „Metodika“, „Platforma“. Nástroj SHALL mít volitelně odkaz na oficiální web, odkaz na veřejný repozitář zdrojového kódu, odkaz na dokumentaci, počet hvězd repozitáře na GitHubu, datum aktualizace, příznak konceptu a odkaz na vlákno v diskuzích. Nástroj MUST mít alespoň jeden z odkazů na oficiální web a na repozitář. Počet hvězd MUST být uveden jen u nástroje s odkazem na repozitář. Odkaz na vlákno MUST vést do diskuzí veřejného repozitáře webu. Nástroj, který tato pravidla porušuje, MUST způsobit selhání sestavení webu s chybovou hláškou, která nástroj identifikuje.

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

#### Scenario: Vlákno mimo diskuze webu
- **WHEN** odkaz na vlákno v metadatech nástroje vede na jiný repozitář nebo jiný web
- **THEN** sestavení selže s chybovou hláškou uvádějící nástroj a pole s odkazem

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

### Requirement: Zpětná vazba u nástroje
Stránka každého publikovaného nástroje SHALL na konci, za sekcí „Oficiální odkazy“, obsahovat sekci „Zpětná vazba“ s těmito odkazy:
- odkaz na diskuzi: na vlákno z metadat nástroje, a když ho nástroj nemá, na kategorii diskuzí pro nástroje,
- odkaz „Navrhnout úpravu“, který otevře zdrojový soubor nástroje v editoru veřejného repozitáře na GitHubu,
- odkaz „Nahlásit zastaralý údaj“, který otevře v repozitáři webu formulář nového issue pro zastaralé údaje s předvyplněným názvem nástroje a absolutní adresou stránky nástroje.

Formulář pro zastaralé údaje MUST vyžadovat odkaz na oficiální zdroj, který nový údaj dokládá. Sekce SHALL uvést, že odkazy vedou na GitHub a vyžadují účet. Odkazy SHALL mít atribut `rel="noopener"`.

#### Scenario: Nahlášení zastaralého údaje
- **WHEN** čtenář na stránce `/nastroje/openspec/` klikne na „Nahlásit zastaralý údaj“
- **THEN** otevře se na GitHubu formulář nového issue, ve kterém je předvyplněn nástroj „OpenSpec“ a adresa `https://specdriven.cz/nastroje/openspec/`

#### Scenario: Hlášení bez zdroje
- **WHEN** čtenář ve formuláři pro zastaralé údaje nevyplní odkaz na oficiální zdroj
- **THEN** GitHub issue neodešle a označí pole se zdrojem jako povinné

#### Scenario: Nástroj bez vlastního vlákna
- **WHEN** nástroj nemá v metadatech odkaz na vlákno a čtenář klikne v sekci „Zpětná vazba“ na odkaz na diskuzi
- **THEN** otevře se kategorie diskuzí pro nástroje v repozitáři webu

#### Scenario: Návrh úpravy nástroje
- **WHEN** čtenář na stránce `/nastroje/openspec/` klikne na „Navrhnout úpravu“
- **THEN** otevře se na GitHubu editor souboru tohoto nástroje ve větvi, ze které se web nasazuje

### Requirement: Odkaz na srovnání nástrojů
Přehled `/nastroje/` SHALL v úvodu odkazovat na článek se srovnáním nástrojů (viz capability `articles`). Stránka každého publikovaného nástroje SHALL za obsahem a před sekcí „Oficiální odkazy“ obsahovat odkaz na srovnání. Odkaz nepíše autor do obsahu nástroje, vkládá ho šablona. Když článek se srovnáním není publikovaný, přehled ani stránky nástrojů na něj MUST NOT odkazovat.

#### Scenario: Odkaz z přehledu
- **WHEN** čtenář otevře `/nastroje/` a klikne v úvodu na odkaz na srovnání
- **THEN** zobrazí se `/clanky/srovnani-nastroju/`

#### Scenario: Odkaz ze stránky nástroje
- **WHEN** čtenář otevře `/nastroje/gsd-core/`
- **THEN** stránka před sekcí „Oficiální odkazy“ obsahuje odkaz na `/clanky/srovnani-nastroju/`

#### Scenario: Srovnání jako koncept
- **WHEN** autor označí článek se srovnáním jako koncept a sestaví produkční verzi webu
- **THEN** přehled `/nastroje/` ani žádná stránka nástroje neobsahuje odkaz na `/clanky/srovnani-nastroju/`
