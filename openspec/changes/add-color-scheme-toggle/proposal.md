## Why

Web dnes zobrazí světlou nebo tmavou variantu jen podle nastavení systému. Kdo chce číst jinak, než má nastavený systém (tmavý systém, ale článek na slunci, nebo naopak), musí přepnout celý systém. Přepínač na stránce je u vývojářských webů běžný a čtenáři ho čekají v hlavičce.

## What Changes

- V hlavičce každé stránky přibude tlačítko, které přepíná mezi světlým a tmavým režimem. Ikona ukazuje režim, na který se kliknutím přepne (☾ ve světlém, ☀ v tmavém).
- Výchozí stav zůstává podle systému. Ruční volba se pamatuje v prohlížeči a platí na všech stránkách i při další návštěvě.
- Když se zvolený režim shoduje se systémovým, web volbu zapomene a dál sleduje systém. Samostatná třetí volba „podle systému“ tak není potřeba.
- Uložená volba se uplatní dřív, než se stránka poprvé vykreslí, takže při načtení nebliká opačný režim.
- Na web přibude první JavaScript: krátký skript v `<head>` a obsluha tlačítka. Bez JavaScriptu se tlačítko nezobrazí a web se chová jako dnes.
- Texty, které tvrdí, že v prohlížeči neběží žádný JavaScript (stránka „Jak vznikl tento web“, `README.md`, `CLAUDE.md`), se upraví podle skutečnosti.

Mimo rozsah: třetí volba „podle systému“ v ovládání, další barevná témata (např. vysoký kontrast), přepínání ikony webu (favicon) podle ručně zvolené varianty, synchronizace volby mezi otevřenými záložkami.

Souvislost: aktivní změna `add-tools-comparison` v návrhu uvádí, že v prohlížeči dál neběží JavaScript. To platí pro ni samotnou (sama žádný skript nepřidává), věta v jejím návrhu jen zastará.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `site-layout`: požadavek „Světlý a tmavý režim“ doplní ruční přepnutí v hlavičce, zapamatování volby, návrat k systémovému režimu, načtení bez bliknutí a chování bez JavaScriptu.

## Impact

- `src/styles/tokens.css`: pravidla, která podle atributu na `<html>` nastaví `color-scheme` na jen světlý nebo jen tmavý režim. Barvy se nemění, všechny už jdou přes `light-dark()`.
- `src/layouts/BaseLayout.astro`: inline skript v `<head>`, který před vykreslením nastaví uloženou volbu.
- `src/components/Header.astro` (nebo nová komponenta vložená do hlavičky): tlačítko, jeho obsluha a rozložení hlavičky na šířce 320 px.
- `src/pages/jak-vznikl-tento-web.astro`, `README.md`, `CLAUDE.md`: věty o JavaScriptu a barevném režimu.
- Žádné nové závislosti a žádné načítání z cizích domén. Volba se ukládá jen v `localStorage` prohlížeče čtenáře, web ji nikam neposílá.
