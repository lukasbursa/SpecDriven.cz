## Purpose

Měření návštěvnosti webu přes Google Analytics 4, které se spustí jen se souhlasem čtenáře, a informace o tom, jaké údaje web zpracovává a jak souhlas změnit nebo odvolat.

## ADDED Requirements

### Requirement: Měření jen se souhlasem
Web SHALL měřit návštěvnost přes Google Analytics 4. Měření MUST se spustit až poté, co čtenář v liště se souhlasem zvolí „Přijmout“. Dokud čtenář souhlas neudělí, web MUST NOT stahovat žádný soubor z domén Googlu, MUST NOT odesílat Googlu žádná data a MUST NOT ukládat do prohlížeče cookies Google Analytics. Měření MUST běžet bez Google signálů a bez personalizace reklam. Měření SHALL běžet jen na doméně specdriven.cz, ne na lokálním vývojovém serveru ani v lokálním náhledu.

#### Scenario: První návštěva
- **WHEN** čtenář poprvé otevře libovolnou stránku webu a na liště zatím nic nezvolí
- **THEN** prohlížeč nestáhne žádný soubor z jiné domény než specdriven.cz a v prohlížeči není žádná cookie začínající `_ga`

#### Scenario: Udělení souhlasu
- **WHEN** čtenář na liště klikne na „Přijmout“
- **THEN** web na téže stránce spustí Google Analytics, zaznamená zobrazení aktuální stránky a lišta zmizí

#### Scenario: Další stránka po souhlasu
- **WHEN** čtenář, který souhlas udělil, otevře další stránku webu
- **THEN** web spustí Google Analytics hned při načtení a lištu nezobrazí

#### Scenario: Odmítnutí
- **WHEN** čtenář na liště klikne na „Odmítnout“
- **THEN** lišta zmizí, Google Analytics se nespustí a ani na dalších stránkách prohlížeč nestáhne nic z domén Googlu

#### Scenario: Lokální vývoj
- **WHEN** autor otevře web na `localhost` a souhlas udělí
- **THEN** prohlížeč nestáhne nic z domén Googlu

### Requirement: Lišta se souhlasem
Dokud čtenář nezvolí, SHALL se na každé stránce zobrazit lišta, která stručně řekne, k čemu web cookies potřebuje, a odkáže na stránku `/ochrana-osobnich-udaju/`. Lišta SHALL nabízet tlačítka „Přijmout“ a „Odmítnout“ se stejnou velikostí, stejnou výrazností a na stejné úrovni. Lišta MUST NOT nabízet předem zvolený souhlas ani jiný způsob zavření než tyto dvě volby. Nezvolení MUST NOT být bráno jako souhlas.

Lišta MUST NOT bránit čtení ani ovládání stránky. Lišta zobrazená při načtení stránky MUST NOT si vzít zaměření klávesnice. Prvním zaměřitelným prvkem stránky SHALL zůstat odkaz „Přeskočit na obsah“, lišta SHALL následovat hned po něm. Lišta MUST být čitelná ve světlém i tmavém režimu s kontrastem podle WCAG AA, MUST mít přístupný název a MUST se vejít na displej široký 320 px bez vodorovného posouvání.

Zvolená odpověď SHALL platit 12 měsíců. Potom se lišta SHALL zobrazit znovu.

#### Scenario: Stejně snadné odmítnutí
- **WHEN** čtenář uvidí lištu
- **THEN** tlačítka „Přijmout“ a „Odmítnout“ jsou vedle sebe, mají stejnou velikost i vzhled a obě jdou ovládat klávesnicí

#### Scenario: Čtení bez volby
- **WHEN** čtenář lištu ignoruje a pokračuje ve čtení nebo přejde na jinou stránku
- **THEN** Google Analytics se nespustí a lišta se zobrazí i na další stránce

#### Scenario: Ovládání klávesnicí
- **WHEN** čtenář po načtení stránky stiskne Tab
- **THEN** zaměří se odkaz „Přeskočit na obsah“, dalšími stisky Tab odkaz na podrobnosti v liště a tlačítka lišty a teprve potom hlavička stránky

#### Scenario: Čtečka obrazovky
- **WHEN** čtečka obrazovky dojde na lištu
- **THEN** oznámí její název a obě tlačítka s jejich textem

#### Scenario: Vypršení volby
- **WHEN** čtenář otevře web víc než 12 měsíců poté, co zvolil
- **THEN** lišta se zobrazí znovu a Google Analytics se do nové volby nespustí

### Requirement: Změna a odvolání souhlasu
Stránka `/ochrana-osobnich-udaju/` SHALL obsahovat tlačítko „Nastavení cookies“, které znovu zobrazí lištu se souhlasem a přesune zaměření klávesnice na její první tlačítko. Po volbě se zaměření SHALL vrátit na tlačítko, které lištu otevřelo. Na stránku vede odkaz „Ochrana osobních údajů“ z patičky každé stránky, patička samotná tlačítko „Nastavení cookies“ MUST NOT obsahovat. Čtenář tak může souhlas kdykoli udělit nebo odvolat. Po odvolání souhlasu web MUST okamžitě přestat odesílat data Googlu a MUST smazat cookies Google Analytics, které uložil.

#### Scenario: Odvolání souhlasu
- **WHEN** čtenář, který souhlas udělil, klikne v patičce na „Ochrana osobních údajů“, na stránce na „Nastavení cookies“ a potom na „Odmítnout“
- **THEN** v prohlížeči už není žádná cookie začínající `_ga` a další stránky Google Analytics nespustí

#### Scenario: Dodatečný souhlas
- **WHEN** čtenář, který měření odmítl, klikne na stránce `/ochrana-osobnich-udaju/` na „Nastavení cookies“ a potom na „Přijmout“
- **THEN** web spustí Google Analytics na aktuální stránce

### Requirement: Prohlížeč bez JavaScriptu
Když prohlížeč nespouští JavaScript, web MUST NOT zobrazit lištu se souhlasem ani tlačítko „Nastavení cookies“ a MUST NOT spustit měření. Ostatní obsah stránky SHALL fungovat beze změny.

#### Scenario: Vypnutý JavaScript
- **WHEN** čtenář otevře libovolnou stránku s vypnutým JavaScriptem
- **THEN** nevidí lištu ani tlačítko „Nastavení cookies“, prohlížeč nestáhne nic z jiné domény než specdriven.cz a odkaz „Ochrana osobních údajů“ v patičce funguje

### Requirement: Stránka „Ochrana osobních údajů“
Web SHALL mít stránku `/ochrana-osobnich-udaju/`, na kterou vede odkaz „Ochrana osobních údajů“ z patičky každé stránky a z lišty se souhlasem. Stránka SHALL věcně a česky popsat:
- kdo je správce údajů a jak ho kontaktovat,
- jaké údaje web přes Google Analytics zpracovává, k jakému účelu a na jakém právním základě (souhlas),
- komu údaje předává, včetně předání do USA a jeho právního rámce,
- jak dlouho se údaje a cookies uchovávají,
- co web ukládá v prohlížeči čtenáře (cookies i `localStorage`), s názvem, účelem a dobou uložení každé položky,
- jak souhlas změnit nebo odvolat, s ovládáním souhlasu přímo na stránce, když prohlížeč spouští JavaScript,
- práva čtenáře podle GDPR včetně práva podat stížnost u Úřadu pro ochranu osobních údajů,
- datum poslední změny stránky.

Fakta o Google Analytics (názvy a doba platnosti cookies, doba uchování dat) SHALL odkazovat na oficiální dokumentaci Googlu.

#### Scenario: Čtenář chce vědět, co se měří
- **WHEN** čtenář klikne v patičce na „Ochrana osobních údajů“
- **THEN** zobrazí se stránka `/ochrana-osobnich-udaju/` s popisem měření, seznamem cookies a údajů v `localStorage` a kontaktem na správce

#### Scenario: Odkaz z lišty
- **WHEN** čtenář na liště klikne na odkaz na podrobnosti
- **THEN** zobrazí se stránka `/ochrana-osobnich-udaju/` a Google Analytics se nespustí
