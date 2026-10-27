# site-layout Specification

## Purpose

Společný rámec všech stránek webu SpecDriven.cz: hlavička s navigací, patička, chybová stránka a základní pravidla jazyka, přístupnosti a zobrazení na různých zařízeních.

## Requirements

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

### Requirement: Jednotná patička
Každá stránka webu SHALL zobrazovat patičku se jménem autora webu, rokem a informacemi definovanými v capability `open-development` a `analytics`. Pod stavovým řádkem SHALL být odkazy patičky a údaj o autorovi a roku na šířce okna 1280 px na jednom řádku. Na užším displeji se smí zalomit.

#### Scenario: Patička na libovolné stránce
- **WHEN** čtenář otevře libovolnou stránku webu včetně stránky 404
- **THEN** na konci stránky je zobrazena patička

#### Scenario: Patička na jednom řádku
- **WHEN** čtenář otevře libovolnou stránku webu v okně širokém 1280 px
- **THEN** odkazy patičky a „© <rok> <autor>“ jsou pod stavovým řádkem na jednom řádku

### Requirement: Stránka 404
Web SHALL pro neexistující adresy vracet stránku 404 v češtině s odkazem na úvodní stránku a na seznam článků. Server MUST tuto stránku vrátit přímo na požadované adrese s HTTP stavem 404, ne se stavem 200 ani přesměrováním na jinou adresu.

#### Scenario: Neexistující adresa
- **WHEN** čtenář otevře adresu, která na webu neexistuje
- **THEN** zobrazí se stránka s informací, že stránka nebyla nalezena, a s odkazy na úvodní stránku a seznam článků

#### Scenario: Stav odpovědi pro vyhledávače
- **WHEN** vyhledávací robot požádá o adresu `https://specdriven.cz/neexistuje/`
- **THEN** server odpoví stavem 404, adresa v prohlížeči se nezmění a tělo odpovědi je česká stránka 404

### Requirement: Český jazyk dokumentu
Všechny stránky SHALL deklarovat jazyk dokumentu jako češtinu (`lang="cs"`) a SHALL zobrazovat data ve formátu běžném v češtině (např. „26. října 2026“).

#### Scenario: Jazyk stránky
- **WHEN** čtečka obrazovky nebo vyhledávač načte libovolnou stránku
- **THEN** kořenový element dokumentu má atribut `lang="cs"`

### Requirement: Přístupnost
Web MUST splňovat úroveň WCAG 2.2 AA v oblastech kontrastu barev, ovládání klávesnicí a sémantické struktury. Každá stránka MUST obsahovat odkaz „Přeskočit na obsah“ jako první fokusovatelný prvek.

#### Scenario: Ovládání klávesnicí
- **WHEN** čtenář prochází stránku klávesou Tab
- **THEN** první zaměřený prvek je odkaz „Přeskočit na obsah“ a každý interaktivní prvek má viditelný indikátor zaměření

#### Scenario: Kontrast textu
- **WHEN** se ověří kontrast běžného textu vůči pozadí ve světlém i tmavém režimu
- **THEN** poměr kontrastu je alespoň 4,5 : 1

### Requirement: Responzivní zobrazení
Web SHALL být plně použitelný na šířce obrazovky od 320 px bez vodorovného posouvání stránky.

#### Scenario: Zobrazení na mobilu
- **WHEN** čtenář otevře libovolnou stránku na zařízení se šířkou 320 px
- **THEN** obsah se vejde na šířku obrazovky a navigace zůstává dostupná

### Requirement: Světlý a tmavý režim
Web SHALL ve výchozím stavu respektovat systémové nastavení barevného režimu čtenáře (`prefers-color-scheme`) a zobrazit světlou nebo tmavou variantu.

Hlavička každé stránky SHALL obsahovat tlačítko, které přepne zobrazenou variantu na opačnou. Tlačítko SHALL mít stálý přístupný název „Tmavý režim“ a jeho stav (zapnuto v tmavé variantě, vypnuto ve světlé) MUST být dostupný asistivním technologiím. Ikona tlačítka SHALL ukazovat variantu, na kterou se kliknutím přepne. Tlačítko MUST mít dotykovou plochu alespoň 44 × 44 px.

Ruční volba SHALL platit na všech stránkách webu i při další návštěvě ve stejném prohlížeči. Když se zvolená varianta shoduje se systémovým nastavením, web SHALL volbu zapomenout a dál sledovat systém. Volba MUST zůstat jen v prohlížeči čtenáře a web ji MUST NOT nikam odesílat.

Uložená volba MUST být uplatněna před prvním vykreslením stránky, takže se při načtení nezobrazí opačná varianta. Když prohlížeč nespouští JavaScript, tlačítko se MUST NOT zobrazit a web SHALL zobrazit variantu podle systému.

#### Scenario: Tmavý režim systému
- **WHEN** čtenář má v systému nastavený tmavý režim a na webu nic nepřepnul
- **THEN** web se zobrazí v tmavé variantě

#### Scenario: Ruční přepnutí
- **WHEN** čtenář se světlým režimem v systému klikne v hlavičce na tlačítko s ikonou měsíce
- **THEN** stránka se zobrazí v tmavé variantě, tlačítko ukazuje ikonu slunce a je označené jako zapnuté

#### Scenario: Volba platí na dalších stránkách
- **WHEN** čtenář přepne na tmavou variantu, přejde na jinou stránku webu, zavře prohlížeč a web znovu otevře
- **THEN** obě stránky se zobrazí v tmavé variantě, ačkoli systém má světlý režim

#### Scenario: Návrat k systému
- **WHEN** čtenář se světlým režimem v systému přepne na tmavou variantu, potom zpět na světlou a později si v systému zapne tmavý režim
- **THEN** web se při dalším načtení zobrazí v tmavé variantě podle systému

#### Scenario: Změna systému při otevřené stránce
- **WHEN** čtenář na webu nic nepřepnul a systém během čtení přejde ze světlého do tmavého režimu
- **THEN** stránka se zobrazí v tmavé variantě a ikona i stav tlačítka odpovídají tmavé variantě

#### Scenario: Načtení bez bliknutí
- **WHEN** čtenář s uloženou tmavou variantou a světlým režimem v systému otevře libovolnou stránku
- **THEN** stránka se od prvního vykreslení zobrazí v tmavé variantě

#### Scenario: Prohlížeč bez JavaScriptu
- **WHEN** čtenář otevře libovolnou stránku s vypnutým JavaScriptem
- **THEN** hlavička neobsahuje tlačítko pro přepnutí režimu a web se zobrazí podle systému

#### Scenario: Tlačítko na mobilu
- **WHEN** čtenář otevře libovolnou stránku na zařízení se šířkou 320 px
- **THEN** tlačítko je v hlavičce viditelné na stejném řádku jako název webu a stránka se nedá posouvat vodorovně

#### Scenario: Ovládání klávesnicí a čtečkou
- **WHEN** čtenář zaměří tlačítko klávesou Tab a stiskne Enter nebo mezerník
- **THEN** varianta se přepne, tlačítko má viditelný indikátor zaměření a čtečka oznámí název „Tmavý režim“ a nový stav

### Requirement: Dekorativní prvky specifikace
Vizuální prvky, které napodobují zápis specifikace (např. prefixy `##` a `###` před nadpisy, oddělovače `---` ve frontmatteru), MUST být čistě dekorativní: čtečky obrazovky je nepředčítají a nejsou součástí textu nadpisů v titulku stránky, v RSS ani ve výsledcích vyhledávačů.

#### Scenario: Nadpis s prefixem
- **WHEN** čtečka obrazovky přečte nadpis sekce zobrazený jako „## Nejnovější články“
- **THEN** přečte pouze „Nejnovější články“

#### Scenario: Kopírování nadpisu
- **WHEN** se ze stránky vygeneruje titulek nebo položka RSS
- **THEN** neobsahuje znaky `#` z dekorativních prefixů

### Requirement: Písmo hostované na vlastní doméně
Web MUST načítat všechna písma ze své vlastní domény a MUST NOT při načtení stránky kontaktovat servery třetích stran (např. Google Fonts). Jedinou výjimkou SHALL být měření návštěvnosti přes Google Analytics, a to jen poté, co k němu čtenář udělil souhlas (viz capability `analytics`). Písmo SHALL správně zobrazovat všechny znaky české abecedy.

#### Scenario: Načtení stránky bez třetích stran
- **WHEN** čtenář, který neudělil souhlas s měřením, otevře libovolnou stránku webu
- **THEN** prohlížeč nestahuje žádné soubory z jiné domény než specdriven.cz

#### Scenario: Načtení stránky po souhlasu s měřením
- **WHEN** čtenář, který udělil souhlas s měřením, otevře libovolnou stránku webu
- **THEN** prohlížeč kromě specdriven.cz kontaktuje jen domény Google Analytics a písma stahuje ze specdriven.cz

#### Scenario: České znaky
- **WHEN** stránka obsahuje text „Příliš žluťoučký kůň úpěl ďábelské ódy“
- **THEN** všechny znaky se zobrazí ve stejném písmu bez náhradních fontů
