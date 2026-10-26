# seo Specification

## Purpose

Metadata pro vyhledávače a sociální sítě, aby byl obsah webu dohledatelný a při sdílení se zobrazoval s náhledem.

## Requirements

### Requirement: Titulek a popis stránky
Každá stránka SHALL mít unikátní element `<title>` ve tvaru „<název stránky> | SpecDriven.cz“ (úvodní stránka pouze „SpecDriven.cz – <podtitul>“) a meta popis. U článků SHALL být meta popisem popis článku.

#### Scenario: Titulek článku
- **WHEN** vyhledávač načte stránku článku „Co je spec-driven development“
- **THEN** titulek stránky je „Co je spec-driven development | SpecDriven.cz“ a meta popis odpovídá popisu článku

### Requirement: Kanonická URL
Každá stránka SHALL obsahovat odkaz `rel="canonical"` s absolutní URL na doméně `https://specdriven.cz` zakončenou lomítkem.

#### Scenario: Kanonická adresa
- **WHEN** vyhledávač načte stránku `/clanky/`
- **THEN** stránka obsahuje kanonický odkaz `https://specdriven.cz/clanky/`

### Requirement: Náhled při sdílení
Každá stránka SHALL obsahovat Open Graph metadata (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale` s hodnotou `cs_CZ`). Stránky článků SHALL mít `og:type` s hodnotou `article`, ostatní stránky `website`.

#### Scenario: Sdílení článku na sociální síti
- **WHEN** někdo sdílí odkaz na článek na sociální síti
- **THEN** náhled zobrazí název článku, jeho popis a obrázek webu

### Requirement: Sitemap a robots.txt
Web SHALL publikovat sitemap se všemi veřejnými stránkami (bez konceptů a bez stránky 404) a soubor `/robots.txt`, který povoluje indexaci a odkazuje na sitemap.

#### Scenario: Robot načte robots.txt
- **WHEN** vyhledávací robot načte `/robots.txt`
- **THEN** soubor povoluje procházení webu a obsahuje absolutní odkaz na sitemap
