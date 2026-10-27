## ADDED Requirements

### Requirement: Adresy bez index.html
Server SHALL požadavek na adresu, která končí `index.html`, trvale přesměrovat (stav 301) na adresu stejné složky s koncovým lomítkem na `https://specdriven.cz`. Adresa složky MUST dál vracet stránku přímo, bez přesměrování.

#### Scenario: Úvodní stránka přes index.html
- **WHEN** čtenář otevře `https://specdriven.cz/index.html`
- **THEN** server odpoví stavem 301 s přesměrováním na `https://specdriven.cz/`

#### Scenario: Stránka v podsložce přes index.html
- **WHEN** čtenář otevře `https://specdriven.cz/clanky/index.html`
- **THEN** server odpoví stavem 301 s přesměrováním na `https://specdriven.cz/clanky/`

#### Scenario: Adresa složky
- **WHEN** čtenář otevře `https://specdriven.cz/clanky/`
- **THEN** server odpoví stavem 200 se stránkou přehledu článků
