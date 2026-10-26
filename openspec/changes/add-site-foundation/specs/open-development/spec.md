## Purpose

Web je sám ukázkou spec-driven developmentu. Tato capability zajišťuje, že se čtenář o tom dozví a může si celý vývojový proces prohlédnout ve veřejném repozitáři.

## ADDED Requirements

### Requirement: Zmínka o SDD v patičce
Patička každé stránky SHALL obsahovat text „Tento web byl vytvořen pomocí SDD – OpenSpec“, kde „SDD“ odkazuje na úvodní článek o spec-driven developmentu a „OpenSpec“ odkazuje na oficiální stránky nástroje OpenSpec.

#### Scenario: Čtenář si všimne patičky
- **WHEN** čtenář sjede na konec libovolné stránky
- **THEN** vidí text „Tento web byl vytvořen pomocí SDD – OpenSpec“ s odkazy na článek o SDD a na OpenSpec

### Requirement: Odkaz na veřejný repozitář
Patička každé stránky SHALL obsahovat odkaz na veřejný repozitář webu s textem, který jasně říká, že jde o zdrojový kód a specifikace webu. Odkazy vedoucí mimo web SHALL mít atribut `rel="noopener"`.

#### Scenario: Prohlédnutí zdrojového kódu
- **WHEN** čtenář klikne v patičce na odkaz na repozitář
- **THEN** otevře se veřejný repozitář webu

### Requirement: Stránka „Jak vznikl tento web“
Web SHALL mít stránku `/jak-vznikl-tento-web/`, která vysvětlí, že web je vyvíjen metodou SDD pomocí OpenSpec, popíše cyklus změny (propose → apply → archive) a odkáže na složky `openspec/specs/` (aktuální specifikace) a `openspec/changes/archive/` (historie změn) ve veřejném repozitáři.

#### Scenario: Čtenář chce vidět postup
- **WHEN** čtenář otevře `/jak-vznikl-tento-web/`
- **THEN** vidí popis postupu a funkční odkazy na aktuální specifikace a archiv změn v repozitáři

#### Scenario: Přístup ze stránky
- **WHEN** čtenář klikne v patičce nebo v navigaci na „Jak vznikl tento web“
- **THEN** zobrazí se stránka `/jak-vznikl-tento-web/`
