## Purpose

Úvodní stránka webu, která nově příchozímu čtenáři během pár vteřin vysvětlí, o čem web je, a nasměruje ho na obsah.

## ADDED Requirements

### Requirement: Vysvětlení SDD na první pohled
Úvodní stránka SHALL v horní části zobrazit hlavní nadpis a krátký úvodní text (nejvýše tři věty), který vysvětlí, co je spec-driven development a co čtenář na webu najde.

#### Scenario: Nový čtenář otevře web
- **WHEN** čtenář otevře úvodní stránku
- **THEN** bez posouvání vidí hlavní nadpis a úvodní text o SDD

### Requirement: Výzva k začátku čtení
Úvodní stránka SHALL obsahovat výrazný odkaz na úvodní článek „Co je spec-driven development“.

#### Scenario: Čtenář chce začít
- **WHEN** čtenář klikne na hlavní výzvu na úvodní stránce
- **THEN** zobrazí se článek „Co je spec-driven development“

### Requirement: Nejnovější články
Úvodní stránka SHALL zobrazovat nejvýše pět nejnovějších publikovaných článků seřazených od nejnovějšího a odkaz na kompletní seznam článků.

#### Scenario: Výpis nejnovějších článků
- **WHEN** na webu je publikováno sedm článků
- **THEN** úvodní stránka zobrazí pět nejnovějších s názvem, datem a popisem a odkaz „Všechny články“

#### Scenario: Koncepty se nezobrazují
- **WHEN** existuje článek označený jako koncept
- **THEN** na úvodní stránce se nezobrazí
