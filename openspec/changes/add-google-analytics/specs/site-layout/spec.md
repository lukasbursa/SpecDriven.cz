## MODIFIED Requirements

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
