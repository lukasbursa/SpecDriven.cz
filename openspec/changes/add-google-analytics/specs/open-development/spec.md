## RENAMED Requirements

- FROM: `### Requirement: Zmínka o SDD v patičce`
- TO: `### Requirement: Zmínka o OpenSpec v patičce`

## MODIFIED Requirements

### Requirement: Zmínka o OpenSpec v patičce
Patička každé stránky SHALL obsahovat text „Vytvořeno pomocí OpenSpec“, kde „OpenSpec“ odkazuje na stránku nástroje OpenSpec na tomto webu (`/nastroje/openspec/`). Když stránka nástroje není publikovaná, odkaz SHALL vést na oficiální stránky nástroje OpenSpec.

#### Scenario: Čtenář si všimne patičky
- **WHEN** čtenář sjede na konec libovolné stránky
- **THEN** vidí text „Vytvořeno pomocí OpenSpec“ a odkaz „OpenSpec“ vede na `/nastroje/openspec/`
