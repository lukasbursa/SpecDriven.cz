## ADDED Requirements

### Requirement: Odkaz na diskuze v patičce
Patička každé stránky SHALL obsahovat odkaz „Diskuze“, který vede na diskuze (GitHub Discussions) veřejného repozitáře webu. Odkaz SHALL mít atribut `rel="noopener"`. Web MUST NOT diskuze vkládat do stránky ani při načtení stránky stahovat cokoli z GitHubu.

#### Scenario: Čtenář chce diskutovat
- **WHEN** čtenář klikne v patičce libovolné stránky na „Diskuze“
- **THEN** otevřou se diskuze repozitáře webu na GitHubu

#### Scenario: Patička bez obsahu třetích stran
- **WHEN** čtenář otevře libovolnou stránku webu
- **THEN** prohlížeč kvůli diskuzím nestahuje žádný soubor z jiné domény než specdriven.cz

### Requirement: Jak přispět
Stránka `/jak-vznikl-tento-web/` SHALL obsahovat sekci „Jak přispět“, která popíše tři cesty příspěvku:
- oprava textu nebo faktu v existujícím článku či stránce nástroje smí přijít přímým pull requestem bez změny v OpenSpec, oprava faktu MUST uvést oficiální zdroj,
- návrh nového článku nebo nástroje začíná issue,
- změna chování, struktury nebo vzhledu webu prochází cyklem propose → apply → archive.

Sekce SHALL odkazovat na diskuze repozitáře a na soubor s pravidly pro přispěvatele (`CONTRIBUTING.md`) v repozitáři. Sekce SHALL uvést, že k příspěvku je potřeba účet na GitHubu.

#### Scenario: Čtenář chce opravit překlep
- **WHEN** čtenář otevře `/jak-vznikl-tento-web/` a přečte sekci „Jak přispět“
- **THEN** dozví se, že opravu může poslat přímo pull requestem bez návrhu změny v OpenSpec

#### Scenario: Čtenář chce změnit vzhled webu
- **WHEN** čtenář hledá, jak navrhnout novou sekci webu
- **THEN** sekce „Jak přispět“ mu řekne, že taková změna prochází cyklem propose → apply → archive, a odkáže na pravidla pro přispěvatele v repozitáři
