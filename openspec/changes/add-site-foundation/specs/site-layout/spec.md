## Purpose

Společný rámec všech stránek webu SpecDriven.cz: hlavička s navigací, patička, chybová stránka a základní pravidla jazyka, přístupnosti a zobrazení na různých zařízeních.

## ADDED Requirements

### Requirement: Jednotná hlavička s navigací
Každá stránka webu SHALL zobrazovat hlavičku s názvem webu „SpecDriven.cz“, který odkazuje na úvodní stránku, a s navigací obsahující odkazy „Články“ a „Jak vznikl tento web“.

#### Scenario: Návrat na úvodní stránku
- **WHEN** čtenář na libovolné stránce klikne na název webu v hlavičce
- **THEN** zobrazí se úvodní stránka

#### Scenario: Zvýraznění aktuální sekce
- **WHEN** čtenář je na stránce, která patří do sekce z navigace (např. detail článku v sekci „Články“)
- **THEN** odkaz na tuto sekci je vizuálně odlišen a označen atributem `aria-current`

### Requirement: Jednotná patička
Každá stránka webu SHALL zobrazovat patičku se jménem autora webu, rokem a informacemi definovanými v capability `open-development`.

#### Scenario: Patička na libovolné stránce
- **WHEN** čtenář otevře libovolnou stránku webu včetně stránky 404
- **THEN** na konci stránky je zobrazena patička

### Requirement: Stránka 404
Web SHALL pro neexistující adresy vracet stránku 404 v češtině s odkazem na úvodní stránku a na seznam článků.

#### Scenario: Neexistující adresa
- **WHEN** čtenář otevře adresu, která na webu neexistuje
- **THEN** zobrazí se stránka s informací, že stránka nebyla nalezena, a s odkazy na úvodní stránku a seznam článků

### Requirement: Český jazyk dokumentu
Všechny stránky SHALL deklarovat jazyk dokumentu jako češtinu (`lang="cs"`) a SHALL zobrazovat data ve formátu běžném v češtině (např. „26. října 2026“).

#### Scenario: Jazyk stránky
- **WHEN** čtečka obrazovky nebo vyhledávač načte libovolnou stránku
- **THEN** kořenový element dokumentu má atribut `lang="cs"`

### Requirement: Přístupnost
Web MUST splňovat úroveň WCAG 2.2 AA v oblastech kontrastu barev, ovládání klávesnicí a sémantické struktury. Každá stránka MUST obsahovat odkaz „Přeskočit na obsah“ jako první fokusovatelný prvek.

#### Scenario: Ovládání klávesnicí
- **WHEN** čtenář prochází stránku klávesou Tab
- **THEN** první zaměřený prvek je odkaz „Přeskočit na obsah“ a každý interaktivní prvek má viditelný indikátor zaměření

#### Scenario: Kontrast textu
- **WHEN** se ověří kontrast běžného textu vůči pozadí ve světlém i tmavém režimu
- **THEN** poměr kontrastu je alespoň 4,5 : 1

### Requirement: Responzivní zobrazení
Web SHALL být plně použitelný na šířce obrazovky od 320 px bez vodorovného posouvání stránky.

#### Scenario: Zobrazení na mobilu
- **WHEN** čtenář otevře libovolnou stránku na zařízení se šířkou 320 px
- **THEN** obsah se vejde na šířku obrazovky a navigace zůstává dostupná

### Requirement: Světlý a tmavý režim
Web SHALL respektovat systémové nastavení barevného režimu čtenáře (`prefers-color-scheme`) a zobrazit světlou nebo tmavou variantu.

#### Scenario: Tmavý režim systému
- **WHEN** čtenář má v systému nastavený tmavý režim
- **THEN** web se zobrazí v tmavé variantě
