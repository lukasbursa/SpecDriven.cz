## MODIFIED Requirements

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
