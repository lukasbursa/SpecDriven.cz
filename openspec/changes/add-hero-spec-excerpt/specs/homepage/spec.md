## ADDED Requirements

### Requirement: Úryvek specifikace v úvodní sekci
Úvodní sekce SHALL zobrazit úryvek specifikace úvodní stránky z repozitáře webu: celý requirement „Vysvětlení SDD na první pohled“ včetně jeho scénářů, v původním znění Markdownu, s cestou k souboru a s čísly řádků v souboru. Text MUST odpovídat souboru specifikace ve stavu, ze kterého byl web sestaven. Pod úryvkem SHALL být odkaz na tyto řádky souboru v repozitáři na GitHubu.

#### Scenario: Úryvek odpovídá specifikaci
- **WHEN** se znění požadavku „Vysvětlení SDD na první pohled“ ve specifikaci změní a web se znovu sestaví
- **THEN** úryvek na úvodní stránce ukáže nové znění a odpovídající čísla řádků

#### Scenario: Požadavek ve specifikaci chybí
- **WHEN** požadavek „Vysvětlení SDD na první pohled“ ve specifikaci úvodní stránky není, například po přejmenování
- **THEN** sestavení webu selže s chybou, která uvádí název chybějícího požadavku a soubor

#### Scenario: Odkaz na GitHub
- **WHEN** čtenář klikne na odkaz pod úryvkem
- **THEN** otevře se soubor specifikace úvodní stránky na GitHubu se zvýrazněnými řádky, které úryvek ukazuje

#### Scenario: Rozvržení na počítači
- **WHEN** čtenář otevře úvodní stránku na obrazovce o šířce 1280 px a výšce 800 px
- **THEN** úryvek je vpravo vedle nadpisu, úvodního textu a scénáře a scénář s odkazem na úvodní článek zůstává viditelný bez posouvání

#### Scenario: Úryvek na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px
- **THEN** úryvek je pod scénářem, jeho řádky se zalamují a stránka nejde vodorovně posouvat

#### Scenario: Úryvek pro čtečku obrazovky
- **WHEN** čtečka obrazovky prochází úvodní sekci
- **THEN** oznámí úryvek jako pojmenovaný blok s ukázkou specifikace úvodní stránky a přečte text požadavku a scénáře bez znaků Markdownu (`#`, `**`, `-`) a bez čísel řádků
