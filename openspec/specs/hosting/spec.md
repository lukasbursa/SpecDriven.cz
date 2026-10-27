# hosting Specification

## Purpose

Chování webového serveru, na kterém web běží: přesměrování na kanonickou doménu, tvar adres, cache hlavičky a ochrana obsahu serveru. Konfigurace je součástí repozitáře a nasazuje se spolu s webem.

## Requirements

### Requirement: Kanonická doména bez www
Server SHALL požadavky na doménu `www.specdriven.cz` trvale přesměrovat (stav 301) na stejnou cestu na `https://specdriven.cz`.

#### Scenario: Otevření s www
- **WHEN** čtenář otevře `https://www.specdriven.cz/jak-vznikl-tento-web/`
- **THEN** server odpoví stavem 301 s přesměrováním na `https://specdriven.cz/jak-vznikl-tento-web/`

### Requirement: Adresy zakončené lomítkem
Server SHALL adresu stránky bez koncového lomítka trvale přesměrovat (stav 301) na stejnou adresu s lomítkem na `https://specdriven.cz`, v souladu s kanonickými URL.

#### Scenario: Adresa bez lomítka
- **WHEN** čtenář otevře `https://specdriven.cz/clanky`
- **THEN** server odpoví stavem 301 s přesměrováním na `https://specdriven.cz/clanky/`

### Requirement: Cache souborů
Soubory, které mají v názvu hash obsahu (složka `/_astro/`), SHALL server posílat s hlavičkou, která prohlížeči dovolí uložit je do cache na jeden rok bez ověřování. Stránky HTML SHALL server posílat s hlavičkou, která prohlížeči nařizuje ověřit aktuálnost u serveru při každém načtení.

#### Scenario: Soubor stylů
- **WHEN** prohlížeč načte soubor stylů z `/_astro/`
- **THEN** odpověď obsahuje `Cache-Control` s `max-age=31536000` a `immutable`

#### Scenario: Nová verze stránky
- **WHEN** se web nasadí a čtenář znovu otevře stránku, kterou už dříve navštívil
- **THEN** prohlížeč zobrazí novou verzi stránky, ne verzi z cache

### Requirement: Žádný výpis složek
Server MUST NOT zobrazovat výpis souborů ve složce, která nemá stránku `index.html`.

#### Scenario: Složka s assety
- **WHEN** někdo otevře `https://specdriven.cz/_astro/`
- **THEN** server nezobrazí seznam souborů ve složce

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
