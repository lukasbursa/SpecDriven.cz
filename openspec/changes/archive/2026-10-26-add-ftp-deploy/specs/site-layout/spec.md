## MODIFIED Requirements

### Requirement: Stránka 404
Web SHALL pro neexistující adresy vracet stránku 404 v češtině s odkazem na úvodní stránku a na seznam článků. Server MUST tuto stránku vrátit přímo na požadované adrese s HTTP stavem 404, ne se stavem 200 ani přesměrováním na jinou adresu.

#### Scenario: Neexistující adresa
- **WHEN** čtenář otevře adresu, která na webu neexistuje
- **THEN** zobrazí se stránka s informací, že stránka nebyla nalezena, a s odkazy na úvodní stránku a seznam článků

#### Scenario: Stav odpovědi pro vyhledávače
- **WHEN** vyhledávací robot požádá o adresu `https://specdriven.cz/neexistuje/`
- **THEN** server odpoví stavem 404, adresa v prohlížeči se nezmění a tělo odpovědi je česká stránka 404
