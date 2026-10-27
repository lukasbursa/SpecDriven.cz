# homepage Specification

## Purpose

Úvodní stránka webu, která nově příchozímu čtenáři během pár vteřin vysvětlí, o čem web je, a nasměruje ho na obsah.

## Requirements

### Requirement: Vysvětlení SDD na první pohled
Úvodní stránka SHALL v horní části zobrazit hlavní nadpis a krátký úvodní text (nejvýše tři věty), který vysvětlí, co je spec-driven development a co čtenář na webu najde. Text MUST být neutrální vůči nástrojům a nesmí doporučovat žádný konkrétní nástroj.

#### Scenario: Nový čtenář otevře web
- **WHEN** čtenář otevře úvodní stránku
- **THEN** bez posouvání vidí hlavní nadpis a úvodní text o SDD

### Requirement: Výzva ve tvaru scénáře
Pod úvodním textem SHALL úvodní stránka zobrazit blok ve tvaru scénáře se dvěma řádky: „WHEN nevíte, co je spec-driven development“ a „THEN“ s výrazným odkazem „Začněte úvodním článkem →“, který vede na článek „Co je spec-driven development“. Blok MUST být viditelný bez posouvání na obrazovce o šířce 1280 px a výšce 800 px. Když se text odkazu nevejde na jeden řádek, šipka MUST zůstat na stejném řádku jako poslední slovo a text nesmí přiléhat k okrajům odkazu.

#### Scenario: Čtenář chce začít
- **WHEN** čtenář klikne na odkaz „Začněte úvodním článkem →“ ve scénáři na úvodní stránce
- **THEN** zobrazí se článek „Co je spec-driven development“

#### Scenario: Scénář pro čtečku obrazovky
- **WHEN** čtečka obrazovky prochází úvodní scénář
- **THEN** přečte srozumitelný text „WHEN nevíte, co je spec-driven development, THEN Začněte úvodním článkem“ a odkaz je ovladatelný klávesnicí

#### Scenario: Výzva na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px nebo 375 px
- **THEN** šipka v odkazu „Začněte úvodním článkem →“ je na stejném řádku jako slovo „článkem“, zalomený text má od horního i dolního okraje odkazu odstup a stránka nejde vodorovně posouvat

### Requirement: Úryvek specifikace v úvodní sekci
Úvodní sekce SHALL zobrazit úryvek specifikace úvodní stránky z repozitáře webu: celý requirement „Vysvětlení SDD na první pohled“ včetně jeho scénářů, v původním znění Markdownu, s cestou k souboru a s čísly řádků v souboru. Text MUST odpovídat souboru specifikace ve stavu, ze kterého byl web sestaven. Pod úryvkem SHALL být odkaz na tyto řádky souboru v repozitáři na GitHubu.

#### Scenario: Úryvek odpovídá specifikaci
- **WHEN** se znění požadavku „Vysvětlení SDD na první pohled“ ve specifikaci změní a web se znovu sestaví
- **THEN** úryvek na úvodní stránce ukáže nové znění a odpovídající čísla řádků

#### Scenario: Požadavek ve specifikaci chybí
- **WHEN** požadavek „Vysvětlení SDD na první pohled“ ve specifikaci úvodní stránky není, například po přejmenování
- **THEN** sestavení webu selže s chybou, která uvádí název chybějícího požadavku a soubor

#### Scenario: Odkaz na GitHub
- **WHEN** čtenář klikne na odkaz pod úryvkem
- **THEN** otevře se soubor specifikace úvodní stránky na GitHubu se zvýrazněnými řádky, které úryvek ukazuje

#### Scenario: Rozvržení na počítači
- **WHEN** čtenář otevře úvodní stránku na obrazovce o šířce 1280 px a výšce 800 px
- **THEN** úryvek je vpravo vedle nadpisu, úvodního textu a scénáře a scénář s odkazem na úvodní článek zůstává viditelný bez posouvání

#### Scenario: Úryvek na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px
- **THEN** úryvek je pod scénářem, jeho řádky se zalamují a stránka nejde vodorovně posouvat

#### Scenario: Úryvek pro čtečku obrazovky
- **WHEN** čtečka obrazovky prochází úvodní sekci
- **THEN** oznámí úryvek jako pojmenovaný blok s ukázkou specifikace úvodní stránky a přečte text požadavku a scénáře bez znaků Markdownu (`#`, `**`, `-`) a bez čísel řádků

### Requirement: Obecný cyklus SDD
Úvodní stránka SHALL zobrazit cyklus spec-driven developmentu v pěti očíslovaných krocích: Záměr, Specifikace, Plán, Implementace, Ověření, každý s jednovětým popisem. Cyklus MUST být popsán obecně, bez názvů souborů, příkazů nebo pojmů specifických pro jeden nástroj.

#### Scenario: Čtenář vidí cyklus
- **WHEN** čtenář sjede pod úvodní sekci
- **THEN** vidí pět kroků v pořadí Záměr, Specifikace, Plán, Implementace, Ověření s krátkým popisem každého

#### Scenario: Cyklus na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px
- **THEN** kroky cyklu jsou pod sebou ve správném pořadí a čitelné bez vodorovného posouvání

### Requirement: Nejnovější články
Úvodní stránka SHALL zobrazovat nejvýše pět nejnovějších publikovaných článků seřazených od nejnovějšího a odkaz na kompletní seznam článků.

#### Scenario: Výpis nejnovějších článků
- **WHEN** na webu je publikováno sedm článků
- **THEN** úvodní stránka zobrazí pět nejnovějších s názvem, datem a popisem a odkaz „Všechny články“

#### Scenario: Koncepty se nezobrazují
- **WHEN** existuje článek označený jako koncept
- **THEN** na úvodní stránce se nezobrazí

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
