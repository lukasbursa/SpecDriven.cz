## MODIFIED Requirements

### Requirement: Stavový řádek vývoje
Patička každé stránky SHALL obsahovat stavový řádek, který ukazuje skutečný stav vývoje webu v okamžiku sestavení: počet specifikací (capabilities v `openspec/specs/`), počet archivovaných změn (v `openspec/changes/archive/`) a název a datum poslední archivované změny. Poslední archivovaná změna je ta, která byla do archivu přidána naposledy. Když má víc změn ve složce archivu stejné datum, MUST o poslední rozhodnout pořadí, v jakém byly archivovány, ne jejich název. Název poslední změny SHALL odkazovat na její složku ve veřejném repozitáři. Hodnoty MUST být načteny ze souborů repozitáře při sestavení, ne zapsány ručně.

#### Scenario: Stav po archivaci změny
- **WHEN** je v repozitáři archivovaná změna `2026-10-30-add-site-foundation` s pěti specifikacemi a web se sestaví
- **THEN** stavový řádek ukazuje „specs: 5“, „archivované změny: 1“ a „poslední: add-site-foundation · 30. 10. 2026“ s odkazem na složku změny v repozitáři

#### Scenario: Nová archivovaná změna
- **WHEN** autor archivuje další změnu a web znovu sestaví
- **THEN** stavový řádek ukazuje vyšší počet archivovaných změn a novou poslední změnu bez ručního zásahu do kódu

#### Scenario: Dvě archivace ve stejný den
- **WHEN** archiv obsahuje `2026-10-27-add-tool-pages` a `2026-10-27-add-community-links`, která byla archivována až po `add-tool-pages`, a web se sestaví
- **THEN** stavový řádek ukazuje „poslední: add-community-links · 27. 10. 2026“

#### Scenario: Archivace před commitem
- **WHEN** autor archivuje změnu a sestaví web dřív, než archivaci commitne
- **THEN** stavový řádek ukazuje jako poslední právě tuto změnu

#### Scenario: Zatím žádná archivovaná změna
- **WHEN** se web sestaví v okamžiku, kdy `openspec/changes/archive/` neobsahuje žádnou změnu
- **THEN** stavový řádek ukazuje „archivované změny: 0“, údaj o poslední změně vynechá a sestavení neselže
