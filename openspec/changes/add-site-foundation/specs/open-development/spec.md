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

### Requirement: Stavový řádek vývoje
Patička každé stránky SHALL obsahovat stavový řádek, který ukazuje skutečný stav vývoje webu v okamžiku sestavení: počet specifikací (capabilities v `openspec/specs/`), počet archivovaných změn (v `openspec/changes/archive/`) a název a datum poslední archivované změny. Název poslední změny SHALL odkazovat na její složku ve veřejném repozitáři. Hodnoty MUST být načteny ze souborů repozitáře při sestavení, ne zapsány ručně.

#### Scenario: Stav po archivaci změny
- **WHEN** je v repozitáři archivovaná změna `2026-10-30-add-site-foundation` s pěti specifikacemi a web se sestaví
- **THEN** stavový řádek ukazuje „specs: 5“, „archivované změny: 1“ a „poslední: add-site-foundation · 30. 10. 2026“ s odkazem na složku změny v repozitáři

#### Scenario: Nová archivovaná změna
- **WHEN** autor archivuje další změnu a web znovu sestaví
- **THEN** stavový řádek ukazuje vyšší počet archivovaných změn a novou poslední změnu bez ručního zásahu do kódu

#### Scenario: Zatím žádná archivovaná změna
- **WHEN** se web sestaví v okamžiku, kdy `openspec/changes/archive/` neobsahuje žádnou změnu
- **THEN** stavový řádek ukazuje „archivované změny: 0“, údaj o poslední změně vynechá a sestavení neselže

### Requirement: Stránka „Jak vznikl tento web“
Web SHALL mít stránku `/jak-vznikl-tento-web/`, která vysvětlí, že web je vyvíjen metodou SDD pomocí OpenSpec, popíše cyklus změny (propose → apply → archive) a odkáže na složky `openspec/specs/` (aktuální specifikace) a `openspec/changes/archive/` (historie změn) ve veřejném repozitáři. Stránka MUST uvádět, že volba OpenSpec pro tento web není doporučením oproti jiným nástrojům.

#### Scenario: Čtenář chce vidět postup
- **WHEN** čtenář otevře `/jak-vznikl-tento-web/`
- **THEN** vidí popis postupu a funkční odkazy na aktuální specifikace a archiv změn v repozitáři

#### Scenario: Přístup ze stránky
- **WHEN** čtenář klikne v patičce nebo v navigaci na „Jak vznikl tento web“
- **THEN** zobrazí se stránka `/jak-vznikl-tento-web/`
