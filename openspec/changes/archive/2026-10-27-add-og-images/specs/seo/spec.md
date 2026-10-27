## MODIFIED Requirements

### Requirement: Náhled při sdílení
Každá stránka SHALL obsahovat Open Graph metadata (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:image:alt`, `og:locale` s hodnotou `cs_CZ`). Stránky článků a stránky nástrojů SHALL mít `og:type` s hodnotou `article`, ostatní stránky `website`. Stránka článku a stránka nástroje SHALL mít v `og:image` vlastní obrázek pro sdílení, pokud ho mají (viz požadavek „Obrázek pro sdílení článku a nástroje“), jinak obrázek webu. Ostatní stránky SHALL mít obrázek webu. `og:image:alt` SHALL obsahovat název stránky.

#### Scenario: Sdílení článku na sociální síti
- **WHEN** někdo sdílí odkaz na článek, který má vlastní obrázek pro sdílení
- **THEN** náhled zobrazí název článku, jeho popis a obrázek tohoto článku

#### Scenario: Sdílení stránky nástroje
- **WHEN** někdo sdílí odkaz na `/nastroje/openspec/`
- **THEN** stránka má `og:type` s hodnotou `article` a náhled zobrazí název a popis nástroje a obrázek nástroje

#### Scenario: Sdílení úvodní stránky
- **WHEN** někdo sdílí odkaz na úvodní stránku
- **THEN** náhled zobrazí obrázek webu

## ADDED Requirements

### Requirement: Obrázek pro sdílení článku a nástroje
Obrázek pro sdílení článku nebo nástroje je nepovinný soubor SVG uložený vedle souboru s obsahem pod stejným názvem a s příponou `.og.svg`. Web SHALL každý takový obrázek publikovaného článku nebo nástroje převést při sestavení na PNG o rozměru 1200×630 px a zveřejnit ho na adrese `/og/clanky/<slug>.png`, případně `/og/nastroje/<slug>.png`. Text v obrázku MUST být vykreslen písmem webu (IBM Plex Sans nebo Mono) včetně českých znaků, nezávisle na písmech nainstalovaných na stroji, který web sestavuje. Obrázky konceptů MUST NOT být zveřejněny.

Publikovaný článek nebo nástroj bez obrázku SHALL použít obrázek webu a sestavení SHALL vypsat varování, které tento článek nebo nástroj uvede. Sestavení kvůli chybějícímu obrázku MUST NOT selhat.

#### Scenario: Článek s obrázkem
- **WHEN** vedle článku `co-je-spec-driven-development.mdx` leží soubor `co-je-spec-driven-development.og.svg` a web se sestaví
- **THEN** na adrese `/og/clanky/co-je-spec-driven-development.png` je PNG o rozměru 1200×630 px a stránka článku na něj odkazuje v `og:image` absolutní adresou

#### Scenario: České znaky v obrázku
- **WHEN** obrázek obsahuje text „Příliš žluťoučký kůň“ v písmu IBM Plex Sans a web se sestaví na stroji, který toto písmo nemá nainstalované
- **THEN** vykreslené PNG ukazuje text písmem IBM Plex Sans se všemi diakritickými znaménky

#### Scenario: Článek bez obrázku
- **WHEN** publikovaný článek nemá vedle sebe soubor `.og.svg` a web se sestaví
- **THEN** sestavení projde, vypíše varování s názvem článku a stránka článku má v `og:image` obrázek webu

#### Scenario: Obrázek konceptu
- **WHEN** článek s příznakem konceptu má vedle sebe soubor `.og.svg`
- **THEN** sestavený web obrázek tohoto článku neobsahuje

### Requirement: Kontrola obrázku při sestavení
Sestavení webu MUST selhat s chybou, která uvede soubor obrázku a důvod, když obrázek pro sdílení:

- nemá rozměr 1200×630 (atributy `width`, `height` a `viewBox`),
- odkazuje na jakýkoli soubor nebo adresu mimo sebe (obrázky, písma, styly),
- obsahuje skript, obsluhu událostí nebo vložený obsah HTML,
- používá jiné písmo než IBM Plex Sans a IBM Plex Mono,
- nejde vykreslit.

#### Scenario: Odkaz na cizí soubor
- **WHEN** obrázek obsahuje `<image href="https://example.com/foto.jpg">` a spustí se sestavení webu
- **THEN** sestavení selže s chybou, která uvede soubor obrázku a odkaz mimo obrázek

#### Scenario: Špatný rozměr
- **WHEN** obrázek má `viewBox="0 0 1000 1000"`
- **THEN** sestavení selže s chybou, která uvede soubor obrázku a požadovaný rozměr 1200×630

#### Scenario: Jiné písmo
- **WHEN** text v obrázku má `font-family="Arial"`
- **THEN** sestavení selže s chybou, která uvede soubor obrázku a povolená písma
