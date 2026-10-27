## MODIFIED Requirements

### Requirement: Jednotná patička
Každá stránka webu SHALL zobrazovat patičku se jménem autora webu, rokem a informacemi definovanými v capability `open-development` a `analytics`. Pod stavovým řádkem SHALL být odkazy patičky a údaj o autorovi a roku na šířce okna 1280 px na jednom řádku. Na užším displeji se smí zalomit.

#### Scenario: Patička na libovolné stránce
- **WHEN** čtenář otevře libovolnou stránku webu včetně stránky 404
- **THEN** na konci stránky je zobrazena patička

#### Scenario: Patička na jednom řádku
- **WHEN** čtenář otevře libovolnou stránku webu v okně širokém 1280 px
- **THEN** odkazy patičky a „© <rok> <autor>“ jsou pod stavovým řádkem na jednom řádku

### Requirement: Písmo hostované na vlastní doméně
Web MUST načítat všechna písma ze své vlastní domény a MUST NOT při načtení stránky kontaktovat servery třetích stran (např. Google Fonts). Jedinou výjimkou SHALL být měření návštěvnosti přes Google Analytics, a to jen poté, co k němu čtenář udělil souhlas (viz capability `analytics`). Písmo SHALL správně zobrazovat všechny znaky české abecedy.

#### Scenario: Načtení stránky bez třetích stran
- **WHEN** čtenář, který neudělil souhlas s měřením, otevře libovolnou stránku webu
- **THEN** prohlížeč nestahuje žádné soubory z jiné domény než specdriven.cz

#### Scenario: Načtení stránky po souhlasu s měřením
- **WHEN** čtenář, který udělil souhlas s měřením, otevře libovolnou stránku webu
- **THEN** prohlížeč kromě specdriven.cz kontaktuje jen domény Google Analytics a písma stahuje ze specdriven.cz

#### Scenario: České znaky
- **WHEN** stránka obsahuje text „Příliš žluťoučký kůň úpěl ďábelské ódy“
- **THEN** všechny znaky se zobrazí ve stejném písmu bez náhradních fontů
