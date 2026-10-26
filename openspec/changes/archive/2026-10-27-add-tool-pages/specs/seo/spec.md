## MODIFIED Requirements

### Requirement: Titulek a popis stránky
Každá stránka SHALL mít unikátní element `<title>` ve tvaru „<název stránky> | SpecDriven.cz“ (úvodní stránka pouze „SpecDriven.cz – <podtitul>“) a meta popis. U článků a stránek nástrojů SHALL být meta popisem jejich popis z metadat.

#### Scenario: Titulek článku
- **WHEN** vyhledávač načte stránku článku „Co je spec-driven development“
- **THEN** titulek stránky je „Co je spec-driven development | SpecDriven.cz“ a meta popis odpovídá popisu článku

#### Scenario: Titulek stránky nástroje
- **WHEN** vyhledávač načte stránku `/nastroje/openspec/`
- **THEN** titulek stránky je „OpenSpec | SpecDriven.cz“ a meta popis odpovídá popisu nástroje

### Requirement: Náhled při sdílení
Každá stránka SHALL obsahovat Open Graph metadata (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale` s hodnotou `cs_CZ`). Stránky článků a stránky nástrojů SHALL mít `og:type` s hodnotou `article`, ostatní stránky `website`.

#### Scenario: Sdílení článku na sociální síti
- **WHEN** někdo sdílí odkaz na článek na sociální síti
- **THEN** náhled zobrazí název článku, jeho popis a obrázek webu

#### Scenario: Sdílení stránky nástroje
- **WHEN** někdo sdílí odkaz na `/nastroje/openspec/`
- **THEN** stránka má `og:type` s hodnotou `article` a náhled zobrazí název a popis nástroje
