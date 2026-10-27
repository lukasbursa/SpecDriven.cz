## Why

Na telefonu je ve scénáři na úvodní stránce málo místa a tlačítko „Začněte úvodním článkem →“ se zalomí tak, že šipka zůstane sama na druhém řádku. Zalomený text navíc nemá nahoře ani dole odsazení a lepí se na okraje tlačítka. Tlačítko je hlavní výzva stránky a takhle vypadá rozbitě.

## What Changes

- Šipka v odkazu zůstane vždy na stejném řádku jako slovo „článkem“, mezi nimi bude nezlomitelná mezera.
- Tlačítka (`.button`) dostanou svislé vnitřní odsazení, aby měl i zalomený text odstup od okrajů. Tlačítka na jeden řádek se tím nezmění, výšku jim dál určuje `min-height: 44px`.
- Do požadavku „Výzva ve tvaru scénáře“ přibude scénář pro úzkou obrazovku.

Text odkazu i šipka zůstávají. Mimo rozsah: rozvržení bloku scénáře (šířka sloupce WHEN/THEN) a jiné části úvodní stránky.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `homepage`: požadavek „Výzva ve tvaru scénáře“ dostane scénář, jak se odkaz zalamuje na šířce 320 px.

## Impact

- `src/pages/index.astro`: nezlomitelná mezera před šipkou v textu odkazu.
- `src/styles/base.css`: svislé odsazení `.button`. Týká se i tlačítek na stránce `/ochrana-osobnich-udaju/`, ta jsou jednořádková a nezmění se.
