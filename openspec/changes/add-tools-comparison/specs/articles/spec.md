## ADDED Requirements

### Requirement: Srovnání nástrojů
Web SHALL obsahovat publikovaný článek „Srovnání nástrojů pro spec-driven development“ na adrese `/clanky/srovnani-nastroju/`, který vedle sebe porovná všechny publikované nástroje (viz capability `tools`). Článek SHALL obsahovat tyto části:
- přehled s typem, licencí, počtem hvězd a datem ověření každého nástroje,
- vysvětlení, co se v jednotlivých nástrojích stane se specifikací po dokončení práce,
- přiřazení kroků nebo příkazů každého nástroje k obecnému cyklu SDD (Záměr, Specifikace, Plán, Implementace, Ověření),
- kde specifikace leží a v jakém formátu se zapisují požadavky,
- jak nástroj ověřuje výsledek,
- jak nástroj zachází s malými změnami,
- podporovaná prostředí,
- otázky, které pomohou s výběrem.

Typ, licence, počet hvězd a datum ověření MUST pocházet z metadat nástroje, ne z textu článku. Ostatní údaje MUST vycházet z oficiálních zdrojů nástroje a MUST odpovídat stavu k datu publikace, případně aktualizace článku. Článek MUST NOT označit žádný nástroj za nejlepší. Článek SHALL uvést, že tento web vzniká v OpenSpec. Každý název nástroje ve srovnávací tabulce SHALL odkazovat na stránku nástroje na webu.

#### Scenario: Otevření srovnání
- **WHEN** čtenář otevře `/clanky/srovnani-nastroju/`
- **THEN** zobrazí se článek s nadpisem „Srovnání nástrojů pro spec-driven development“ a přehledem, ve kterém jsou všechny publikované nástroje

#### Scenario: Údaje z metadat nástroje
- **WHEN** autor změní počet hvězd v metadatech nástroje OpenSpec a sestaví web
- **THEN** přehled ve srovnání ukazuje nový počet hvězd a nové datum ověření, aniž by se upravoval text článku

#### Scenario: Pořadí nástrojů
- **WHEN** čtenář otevře `/clanky/srovnani-nastroju/`
- **THEN** nástroje jsou v každé srovnávací tabulce ve stejném pořadí jako v přehledu `/nastroje/`

#### Scenario: Odkaz z tabulky
- **WHEN** čtenář ve srovnávací tabulce klikne na název Kiro
- **THEN** zobrazí se stránka `/nastroje/kiro/`

### Requirement: Úplnost srovnávacích tabulek
Každá srovnávací tabulka MUST obsahovat právě jeden řádek pro každý publikovaný nástroj. Každý sloupec, jehož údaje píše autor, MUST mít neprázdnou hodnotu pro každý publikovaný nástroj. Tabulka, ve které hodnota pro publikovaný nástroj chybí nebo je prázdná, MUST způsobit selhání sestavení webu s chybovou hláškou, která uvede tabulku, sloupec a nástroj. Hodnota pro nástroj, který na webu neexistuje, MUST také způsobit selhání sestavení. Nástroje označené jako koncept se do tabulky nevypisují a chybějící hodnota u nich sestavení neshodí.

#### Scenario: Nový nástroj bez údajů ve srovnání
- **WHEN** autor publikuje nový nástroj a ve srovnávacím sloupci „Záměr“ pro něj nedoplní hodnotu
- **THEN** sestavení selže s chybovou hláškou, která uvede tabulku, sloupec „Záměr“ a nový nástroj

#### Scenario: Neznámý nástroj
- **WHEN** srovnávací tabulka obsahuje hodnotu pro nástroj, jehož soubor byl přejmenován nebo odstraněn
- **THEN** sestavení selže s chybovou hláškou, která uvede tabulku a neznámý nástroj

#### Scenario: Koncept nástroje
- **WHEN** autor přidá nástroj jako koncept a do srovnání ho nedoplní
- **THEN** sestavení projde a koncept se v žádné srovnávací tabulce nezobrazí

### Requirement: Čitelnost srovnávacích tabulek
Srovnávací tabulka SHALL mít název, který čtečky obrazovky oznámí jako název tabulky. Názvy nástrojů v prvním sloupci SHALL být záhlavím řádku a názvy sloupců záhlavím sloupce. Když je tabulka širší než dostupný prostor, SHALL se posouvat vodorovně jen tabulka, ne celá stránka, a první sloupec s názvem nástroje SHALL při posouvání zůstat vidět. Posouvanou oblast MUST jít ovládat klávesnicí a MUST mít viditelný stav zaměření. Tabulka MUST být čitelná ve světlém i tmavém režimu s kontrastem podle WCAG AA.

#### Scenario: Tabulka na mobilu
- **WHEN** čtenář otevře srovnání na šířce 320 px a posune tabulku cyklu doprava
- **THEN** stránka se vodorovně neposouvá a název nástroje v prvním sloupci zůstává vidět vedle právě čtených buněk

#### Scenario: Posouvání klávesnicí
- **WHEN** čtenář přejde klávesou Tab na posouvanou tabulku a stiskne šipku doprava
- **THEN** tabulka se posune a má viditelný rámeček zaměření

#### Scenario: Tabulka ve čtečce obrazovky
- **WHEN** čtečka obrazovky čte buňku ve sloupci „Ověření“ v řádku OpenSpec
- **THEN** oznámí název tabulky, záhlaví řádku „OpenSpec“ a záhlaví sloupce „Ověření“
