## MODIFIED Requirements

### Requirement: Povinná metadata článku
Každý článek MUST mít název, popis (nejvýše 160 znaků), datum publikace a SHALL mít volitelně datum aktualizace, seznam štítků, příznak konceptu a odkaz na vlákno v diskuzích. Odkaz na vlákno MUST vést do diskuzí veřejného repozitáře webu. Článek s chybějícími nebo neplatnými povinnými metadaty nebo s odkazem na vlákno mimo diskuze repozitáře webu MUST způsobit selhání sestavení webu s chybovou hláškou, která článek identifikuje.

#### Scenario: Chybějící popis
- **WHEN** autor přidá článek bez popisu a spustí sestavení webu
- **THEN** sestavení selže a chybová hláška uvede soubor článku a chybějící pole

#### Scenario: Příliš dlouhý popis
- **WHEN** popis článku má více než 160 znaků
- **THEN** sestavení selže s chybovou hláškou uvádějící článek

#### Scenario: Vlákno mimo diskuze webu
- **WHEN** odkaz na vlákno v metadatech článku vede na jiný repozitář nebo jiný web
- **THEN** sestavení selže s chybovou hláškou uvádějící článek a pole s odkazem

## ADDED Requirements

### Requirement: Zpětná vazba u článku
Stránka každého publikovaného článku SHALL na konci, za obsahem článku, obsahovat sekci „Zpětná vazba“ s těmito odkazy:
- odkaz na diskuzi: na vlákno z metadat článku, a když ho článek nemá, na kategorii diskuzí pro články,
- odkaz „Navrhnout úpravu“, který otevře zdrojový soubor článku v editoru veřejného repozitáře na GitHubu.

Sekce SHALL uvést, že odkazy vedou na GitHub a vyžadují účet. Odkazy SHALL mít atribut `rel="noopener"`.

#### Scenario: Článek bez vlastního vlákna
- **WHEN** čtenář otevře článek, který v metadatech nemá odkaz na vlákno, a klikne v sekci „Zpětná vazba“ na odkaz na diskuzi
- **THEN** otevře se kategorie diskuzí pro články v repozitáři webu

#### Scenario: Článek s vlastním vláknem
- **WHEN** článek má v metadatech odkaz na vlákno a čtenář klikne v sekci „Zpětná vazba“ na odkaz na diskuzi
- **THEN** otevře se toto vlákno

#### Scenario: Návrh úpravy článku
- **WHEN** čtenář na stránce `/clanky/co-je-spec-driven-development/` klikne na „Navrhnout úpravu“
- **THEN** otevře se na GitHubu editor souboru tohoto článku ve větvi, ze které se web nasazuje
