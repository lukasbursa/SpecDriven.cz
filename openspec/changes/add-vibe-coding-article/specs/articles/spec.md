## ADDED Requirements

### Requirement: Srovnání vibe codingu se spec-driven developmentem
Web SHALL obsahovat publikovaný článek „Konec vibe codingu? Přichází spec-driven development“ na adrese `/clanky/konec-vibe-codingu/`, který srovná vibe coding se spec-driven developmentem. Článek SHALL obsahovat tyto části:
- vymezení pojmu vibe coding podle toho, jak ho zavedl Andrej Karpathy, s odkazem na původní zdroj,
- situace, ve kterých vibe coding stačí,
- situace, ve kterých vibe coding naráží, a proč,
- srovnání obou přístupů vedle sebe v tabulce,
- co přinese specifikace, s příkladem stejné změny provedené oběma způsoby,
- doporučení, kdy zvolit který přístup.

Článek je názorový: MUST mít štítek `názor` a smí používat ostřejší formulace. Každé faktické tvrzení (definice pojmu, výsledek studie, údaj o nástroji) MUST odkazovat na zdroj, ze kterého pochází. Článek MUST NOT tvrdit, že se vibe coding už nepoužívá, a MUST uvést aspoň jednu situaci, ve které je vibe coding vhodná volba. Příklad SHALL vycházet z repozitáře tohoto webu a článek SHALL uvést, že web vzniká v OpenSpec. Úvodní článek „Co je spec-driven development“ SHALL na nový článek odkazovat.

#### Scenario: Otevření článku
- **WHEN** čtenář otevře `/clanky/konec-vibe-codingu/`
- **THEN** zobrazí se článek s nadpisem „Konec vibe codingu? Přichází spec-driven development“ a štítkem `názor`

#### Scenario: Definice se zdrojem
- **WHEN** čtenář v článku dojde k vymezení pojmu vibe coding
- **THEN** u vymezení je odkaz na původní Karpathyho příspěvek

#### Scenario: Volba přístupu
- **WHEN** čtenář dočte článek
- **THEN** článek mu dá aspoň jednu situaci, ve které stačí vibe coding, a aspoň jednu, ve které potřebuje specifikaci

#### Scenario: Fakta bez zdroje
- **WHEN** autor při revizi najde v článku faktické tvrzení bez odkazu na zdroj
- **THEN** tvrzení se před publikací doplní o zdroj, nebo se z článku odstraní

#### Scenario: Odkaz z úvodního článku
- **WHEN** čtenář v úvodním článku v sekci „Proč se o SDD mluví právě teď“ klikne na odkaz na nový článek
- **THEN** zobrazí se stránka `/clanky/konec-vibe-codingu/`
