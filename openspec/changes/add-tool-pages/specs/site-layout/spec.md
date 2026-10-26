## MODIFIED Requirements

### Requirement: Jednotná hlavička s navigací
Každá stránka webu SHALL zobrazovat hlavičku s názvem webu „SpecDriven.cz“, který odkazuje na úvodní stránku, a s navigací obsahující v tomto pořadí odkazy „Články“, „Nástroje“ a „Jak vznikl tento web“.

#### Scenario: Návrat na úvodní stránku
- **WHEN** čtenář na libovolné stránce klikne na název webu v hlavičce
- **THEN** zobrazí se úvodní stránka

#### Scenario: Zvýraznění aktuální sekce
- **WHEN** čtenář je na stránce, která patří do sekce z navigace (např. detail článku v sekci „Články“)
- **THEN** odkaz na tuto sekci je vizuálně odlišen a označen atributem `aria-current`

#### Scenario: Stránka nástroje v sekci Nástroje
- **WHEN** čtenář je na stránce `/nastroje/openspec/`
- **THEN** odkaz „Nástroje“ v navigaci je vizuálně odlišen a označen atributem `aria-current`
