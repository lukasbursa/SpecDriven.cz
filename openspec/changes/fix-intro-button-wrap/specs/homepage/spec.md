## MODIFIED Requirements

### Requirement: Výzva ve tvaru scénáře
Pod úvodním textem SHALL úvodní stránka zobrazit blok ve tvaru scénáře se dvěma řádky: „WHEN nevíte, co je spec-driven development“ a „THEN“ s výrazným odkazem „Začněte úvodním článkem →“, který vede na článek „Co je spec-driven development“. Blok MUST být viditelný bez posouvání na obrazovce o šířce 1280 px a výšce 800 px. Když se text odkazu nevejde na jeden řádek, šipka MUST zůstat na stejném řádku jako poslední slovo a text nesmí přiléhat k okrajům odkazu.

#### Scenario: Čtenář chce začít
- **WHEN** čtenář klikne na odkaz „Začněte úvodním článkem →“ ve scénáři na úvodní stránce
- **THEN** zobrazí se článek „Co je spec-driven development“

#### Scenario: Scénář pro čtečku obrazovky
- **WHEN** čtečka obrazovky prochází úvodní scénář
- **THEN** přečte srozumitelný text „WHEN nevíte, co je spec-driven development, THEN Začněte úvodním článkem“ a odkaz je ovladatelný klávesnicí

#### Scenario: Výzva na mobilu
- **WHEN** čtenář otevře úvodní stránku na šířce 320 px nebo 375 px
- **THEN** šipka v odkazu „Začněte úvodním článkem →“ je na stejném řádku jako slovo „článkem“, zalomený text má od horního i dolního okraje odkazu odstup a stránka nejde vodorovně posouvat
