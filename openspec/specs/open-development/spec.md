# open-development Specification

## Purpose

Web je sám ukázkou spec-driven developmentu. Tato capability zajišťuje, že se čtenář o tom dozví a může si celý vývojový proces prohlédnout ve veřejném repozitáři.

## Requirements

### Requirement: Zmínka o OpenSpec v patičce
Patička každé stránky SHALL obsahovat text „Vytvořeno pomocí OpenSpec“, kde „OpenSpec“ odkazuje na stránku nástroje OpenSpec na tomto webu (`/nastroje/openspec/`). Když stránka nástroje není publikovaná, odkaz SHALL vést na oficiální stránky nástroje OpenSpec.

#### Scenario: Čtenář si všimne patičky
- **WHEN** čtenář sjede na konec libovolné stránky
- **THEN** vidí text „Vytvořeno pomocí OpenSpec“ a odkaz „OpenSpec“ vede na `/nastroje/openspec/`

### Requirement: Odkaz na veřejný repozitář
Patička každé stránky SHALL obsahovat odkaz na veřejný repozitář webu s textem, který jasně říká, že jde o zdrojový kód a specifikace webu. Odkazy vedoucí mimo web SHALL mít atribut `rel="noopener"`.

#### Scenario: Prohlédnutí zdrojového kódu
- **WHEN** čtenář klikne v patičce na odkaz na repozitář
- **THEN** otevře se veřejný repozitář webu

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

### Requirement: Stránka „Jak vznikl tento web“
Web SHALL mít stránku `/jak-vznikl-tento-web/`, která vysvětlí, že web je vyvíjen metodou SDD pomocí OpenSpec, popíše cyklus změny (propose → apply → archive) a odkáže na složky `openspec/specs/` (aktuální specifikace) a `openspec/changes/archive/` (historie změn) ve veřejném repozitáři. Stránka MUST uvádět, že volba OpenSpec pro tento web není doporučením oproti jiným nástrojům.

#### Scenario: Čtenář chce vidět postup
- **WHEN** čtenář otevře `/jak-vznikl-tento-web/`
- **THEN** vidí popis postupu a funkční odkazy na aktuální specifikace a archiv změn v repozitáři

#### Scenario: Přístup ze stránky
- **WHEN** čtenář klikne v patičce nebo v navigaci na „Jak vznikl tento web“
- **THEN** zobrazí se stránka `/jak-vznikl-tento-web/`

### Requirement: Odkaz na diskuze v patičce
Patička každé stránky SHALL obsahovat odkaz „Diskuze“, který vede na diskuze (GitHub Discussions) veřejného repozitáře webu. Odkaz SHALL mít atribut `rel="noopener"`. Web MUST NOT diskuze vkládat do stránky ani při načtení stránky stahovat cokoli z GitHubu.

#### Scenario: Čtenář chce diskutovat
- **WHEN** čtenář klikne v patičce libovolné stránky na „Diskuze“
- **THEN** otevřou se diskuze repozitáře webu na GitHubu

#### Scenario: Patička bez obsahu třetích stran
- **WHEN** čtenář otevře libovolnou stránku webu
- **THEN** prohlížeč kvůli diskuzím nestahuje žádný soubor z jiné domény než specdriven.cz

### Requirement: Jak přispět
Stránka `/jak-vznikl-tento-web/` SHALL obsahovat sekci „Jak přispět“, která popíše tři cesty příspěvku:
- oprava textu nebo faktu v existujícím článku či stránce nástroje smí přijít přímým pull requestem bez změny v OpenSpec, oprava faktu MUST uvést oficiální zdroj,
- návrh nového článku nebo nástroje začíná issue,
- změna chování, struktury nebo vzhledu webu prochází cyklem propose → apply → archive.

Sekce SHALL odkazovat na diskuze repozitáře a na soubor s pravidly pro přispěvatele (`CONTRIBUTING.md`) v repozitáři. Sekce SHALL uvést, že k příspěvku je potřeba účet na GitHubu.

#### Scenario: Čtenář chce opravit překlep
- **WHEN** čtenář otevře `/jak-vznikl-tento-web/` a přečte sekci „Jak přispět“
- **THEN** dozví se, že opravu může poslat přímo pull requestem bez návrhu změny v OpenSpec

#### Scenario: Čtenář chce změnit vzhled webu
- **WHEN** čtenář hledá, jak navrhnout novou sekci webu
- **THEN** sekce „Jak přispět“ mu řekne, že taková změna prochází cyklem propose → apply → archive, a odkáže na pravidla pro přispěvatele v repozitáři
