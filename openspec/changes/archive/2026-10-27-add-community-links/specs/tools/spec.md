## MODIFIED Requirements

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

## ADDED Requirements

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
