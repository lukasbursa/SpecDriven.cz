## ADDED Requirements

### Requirement: Datum poslední změny stránky
Stránka článku a stránka nástroje SHALL mít určené datum poslední změny:

- u článku datum aktualizace, a když ho článek nemá, datum publikace,
- u nástroje nejnovější z data publikace, data aktualizace a data ověření.

Stránka nástroje SHALL toto datum uvádět v metadatu `article:modified_time`. Stránka článku SHALL uvádět `article:modified_time`, jen když má datum aktualizace. Strukturovaná data a sitemap MUST používat stejné datum poslední změny.

#### Scenario: Nově ověřený nástroj
- **WHEN** nástroj má datum publikace 27. 10. 2026, žádné datum aktualizace a datum ověření 15. 11. 2026
- **THEN** stránka nástroje uvádí v `article:modified_time` i ve strukturovaných datech jako datum změny 15. 11. 2026

#### Scenario: Článek bez aktualizace
- **WHEN** článek má jen datum publikace
- **THEN** stránka článku nemá metadatum `article:modified_time` a strukturovaná data uvádějí jako datum změny datum publikace

### Requirement: Strukturovaná data
Stránky SHALL obsahovat strukturovaná data ve formátu JSON-LD podle slovníku schema.org:

- úvodní stránka: web (`WebSite`) s názvem, adresou, popisem a jazykem `cs`, jehož vydavatelem je autor,
- stránka článku: `Article` s názvem, popisem, kanonickou adresou, obrázkem pro sdílení, jazykem `cs`, datem publikace, datem poslední změny a autorem, který je zároveň vydavatelem,
- stránka nástroje: totéž jako stránka článku a navíc popis nástroje (`SoftwareApplication`) s názvem, kategorií vývojářský software a odkazem na oficiální web, případně repozitář,
- stránky článků a nástrojů a přehledy `/clanky/` a `/nastroje/`: drobečková navigace (`BreadcrumbList`) od úvodní stránky po aktuální stránku.

Hodnoty MUST pocházet z metadat obsahu a z nastavení webu, ne z ručně psaného textu. Strukturovaná data MUST být platný JSON a MUST NOT obsahovat nic, co by prohlížeč spustil jako skript.

#### Scenario: Strukturovaná data článku
- **WHEN** vyhledávač načte `/clanky/co-je-spec-driven-development/`
- **THEN** stránka obsahuje JSON-LD typu `Article` s názvem „Co je spec-driven development“, datem publikace 26. 10. 2026, datem změny 27. 10. 2026 a autorem Lukáš Burša

#### Scenario: Strukturovaná data nástroje
- **WHEN** vyhledávač načte `/nastroje/openspec/`
- **THEN** stránka obsahuje JSON-LD typu `Article`, jehož předmětem je `SoftwareApplication` s názvem „OpenSpec“ a adresou `https://openspec.dev/`

#### Scenario: Drobečková navigace
- **WHEN** vyhledávač načte `/nastroje/openspec/`
- **THEN** stránka obsahuje `BreadcrumbList` s položkami úvodní stránka, „Nástroje“ (`https://specdriven.cz/nastroje/`) a „OpenSpec“

#### Scenario: Uvozovky a znaky HTML v názvu
- **WHEN** název nebo popis obsahu obsahuje uvozovky nebo znaky `<` a `>`
- **THEN** strukturovaná data zůstanou platným JSON a text uvnitř neukončí element `<script>`

### Requirement: Autor v metadatech stránky
Každá stránka SHALL v hlavičce obsahovat `<meta name="author">` se jménem autora webu. Ve strukturovaných datech SHALL být autor osoba (`Person`) se jménem a s odkazem na svůj profil na GitHubu.

#### Scenario: Autor v hlavičce
- **WHEN** vyhledávač načte libovolnou stránku webu
- **THEN** hlavička stránky obsahuje `<meta name="author" content="Lukáš Burša">`

#### Scenario: Profil autora
- **WHEN** vyhledávač čte strukturovaná data stránky článku
- **THEN** autor je typu `Person` a uvádí odkaz `https://github.com/lukasbursa`

### Requirement: Datum změny v sitemapě
Sitemap SHALL u stránek článků a nástrojů uvádět `lastmod` s datem poslední změny stránky. Přehled `/clanky/` SHALL mít `lastmod` nejnovějšího publikovaného článku, přehled `/nastroje/` nejnovějšího publikovaného nástroje a úvodní stránka nejnovější datum ze všech článků a nástrojů. Stránky, jejichž datum nejde určit z metadat obsahu, MUST NOT mít `lastmod` uvedené.

#### Scenario: Aktualizovaný článek v sitemapě
- **WHEN** autor u článku vyplní datum aktualizace a web se znovu sestaví
- **THEN** položka článku v sitemapě má `lastmod` s tímto datem

#### Scenario: Přehled nástrojů v sitemapě
- **WHEN** nejnovější datum poslední změny ze všech publikovaných nástrojů je 15. 11. 2026
- **THEN** položka `/nastroje/` v sitemapě má `lastmod` 15. 11. 2026

#### Scenario: Stránka bez data
- **WHEN** vyhledávač načte sitemap
- **THEN** položka `/jak-vznikl-tento-web/` nemá `lastmod`

### Requirement: Stránka 404 mimo index
Stránka 404 SHALL obsahovat `<meta name="robots" content="noindex">`, aby ji vyhledávač nezařadil do výsledků ani na přímé adrese souboru.

#### Scenario: Přímá adresa stránky 404
- **WHEN** vyhledávací robot načte `https://specdriven.cz/404.html`
- **THEN** stránka obsahuje `<meta name="robots" content="noindex">`
