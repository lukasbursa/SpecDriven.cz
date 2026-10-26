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
Pod úvodním textem SHALL úvodní stránka zobrazit blok ve tvaru scénáře se dvěma řádky: „WHEN nevíte, co je spec-driven development“ a „THEN“ s výrazným odkazem „Začněte úvodním článkem →“, který vede na článek „Co je spec-driven development“. Blok MUST být viditelný bez posouvání na obrazovce o šířce 1280 px a výšce 800 px.

#### Scenario: Čtenář chce začít
- **WHEN** čtenář klikne na odkaz „Začněte úvodním článkem →“ ve scénáři na úvodní stránce
- **THEN** zobrazí se článek „Co je spec-driven development“

#### Scenario: Scénář pro čtečku obrazovky
- **WHEN** čtečka obrazovky prochází úvodní scénář
- **THEN** přečte srozumitelný text „WHEN nevíte, co je spec-driven development, THEN Začněte úvodním článkem“ a odkaz je ovladatelný klávesnicí

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
