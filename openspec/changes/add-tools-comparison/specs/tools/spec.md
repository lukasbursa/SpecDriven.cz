## ADDED Requirements

### Requirement: Odkaz na srovnání nástrojů
Přehled `/nastroje/` SHALL v úvodu odkazovat na článek se srovnáním nástrojů (viz capability `articles`). Stránka každého publikovaného nástroje SHALL za obsahem a před sekcí „Oficiální odkazy“ obsahovat odkaz na srovnání. Odkaz nepíše autor do obsahu nástroje, vkládá ho šablona. Když článek se srovnáním není publikovaný, přehled ani stránky nástrojů na něj MUST NOT odkazovat.

#### Scenario: Odkaz z přehledu
- **WHEN** čtenář otevře `/nastroje/` a klikne v úvodu na odkaz na srovnání
- **THEN** zobrazí se `/clanky/srovnani-nastroju/`

#### Scenario: Odkaz ze stránky nástroje
- **WHEN** čtenář otevře `/nastroje/gsd-core/`
- **THEN** stránka před sekcí „Oficiální odkazy“ obsahuje odkaz na `/clanky/srovnani-nastroju/`

#### Scenario: Srovnání jako koncept
- **WHEN** autor označí článek se srovnáním jako koncept a sestaví produkční verzi webu
- **THEN** přehled `/nastroje/` ani žádná stránka nástroje neobsahuje odkaz na `/clanky/srovnani-nastroju/`
