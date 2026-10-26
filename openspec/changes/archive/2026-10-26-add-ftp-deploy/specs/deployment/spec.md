## Purpose

Automatické nasazení webu na hosting: kdy se spustí, co musí projít před nahráním, jak se obsah serveru sladí s buildem a jak se zachází s přístupovými údaji ve veřejném repozitáři.

## ADDED Requirements

### Requirement: Spuštění po pushi do main
Nasazení SHALL proběhnout automaticky po každém pushi do větve `main`. Nasazení MUST NOT proběhnout z pull requestu ani z jiné větve než `main`.

#### Scenario: Push do main
- **WHEN** autor pushne commit do větve `main`
- **THEN** spustí se nasazení webu z tohoto commitu

#### Scenario: Pull request
- **WHEN** někdo otevře nebo aktualizuje pull request, a to i z forku
- **THEN** nasazení se nespustí a přístupové údaje k hostingu nejsou k dispozici

#### Scenario: Push do jiné větve
- **WHEN** autor pushne commit do jiné větve než `main`
- **THEN** nasazení se nespustí

### Requirement: Zkušební režim
Autor SHALL mít možnost spustit nasazení ručně z větve `main` ve zkušebním režimu. Zkušební režim SHALL vypsat soubory, které by se nahrály a smazaly, a MUST NOT na hostingu nic změnit. Ruční spuštění SHALL být ve výchozím stavu zkušební.

#### Scenario: Kontrola před prvním nasazením
- **WHEN** autor ručně spustí nasazení ve zkušebním režimu
- **THEN** log obsahuje seznam souborů k nahrání a ke smazání a obsah hostingu zůstane beze změny

### Requirement: Kontrola před nahráním
Před nahráním na hosting MUST projít kontrola typů a diagnostiky webu i sestavení webu. Když kontrola nebo sestavení selže, nasazení SHALL skončit chybou a na hosting se MUST NOT nahrát žádný soubor.

#### Scenario: Chyba při sestavení
- **WHEN** článek s neplatnými metadaty shodí sestavení webu
- **THEN** nasazení skončí chybou, na hostingu zůstane předchozí verze webu beze změny

#### Scenario: Úspěšná kontrola a sestavení
- **WHEN** kontrola i sestavení projdou
- **THEN** výsledek sestavení se nahraje na hosting

### Requirement: Obsah serveru odpovídá sestavení
Web se nahrává do kořenové složky FTP účtu. Po úspěšném nasazení SHALL tato složka obsahovat právě soubory z výsledku sestavení. Soubory, které nové sestavení už nevytváří, SHALL být ze serveru odstraněny. Složka `.well-known/` (ověřování certifikátů a domény) MUST zůstat nedotčena.

#### Scenario: Změněný styl
- **WHEN** se změní CSS a nové sestavení vytvoří soubor stylů s jiným hashem v názvu
- **THEN** po nasazení je na serveru nový soubor stylů a starý je odstraněn

#### Scenario: Smazaný článek
- **WHEN** autor článek smaže a web se nasadí
- **THEN** adresa článku na hostingu vrací stránku 404

#### Scenario: Ověřovací soubory hostingu
- **WHEN** hosting má ve složce `.well-known/` soubory pro vydání certifikátu a web se nasadí
- **THEN** tyto soubory na serveru zůstanou

### Requirement: Web funkční během nasazení
Nasazení SHALL nahrávat soubory v takovém pořadí, aby každá stránka načtená během nasazení odkazovala jen na styly, písma a obrázky, které už na serveru jsou.

#### Scenario: Čtenář otevře stránku uprostřed nasazení
- **WHEN** čtenář načte stránku ve chvíli, kdy už je nahrané nové HTML a ještě probíhá mazání starých souborů
- **THEN** stránka se zobrazí se styly a písmem

### Requirement: Přístupové údaje mimo repozitář
Údaje pro přístup na hosting (server, uživatel, heslo) SHALL být uložené výhradně v secrets repozitáře na GitHubu. Repozitář MUST NOT obsahovat žádný z těchto údajů a heslo MUST NOT být vypsáno do logu nasazení. Když některý údaj chybí, nasazení SHALL skončit chybou ještě před připojením k serveru a uvést název chybějícího údaje.

#### Scenario: Chybějící heslo
- **WHEN** secret s heslem není nastavený a spustí se nasazení
- **THEN** nasazení skončí chybou s názvem chybějícího secretu a k serveru se nepřipojí

#### Scenario: Prohlížení logu
- **WHEN** kdokoli otevře log proběhlého nasazení ve veřejném repozitáři
- **THEN** v logu není heslo k hostingu

### Requirement: Jedno nasazení najednou
Nasazení MUST NOT běžet souběžně. Když přijde další push do `main` během probíhajícího nasazení, nové nasazení SHALL počkat na dokončení předchozího. Po doběhnutí všech nasazení SHALL hosting obsahovat web z posledního commitu.

#### Scenario: Dva pushe rychle po sobě
- **WHEN** autor pushne do `main` dva commity krátce po sobě
- **THEN** nasazení proběhnou postupně a na hostingu je web z druhého commitu
