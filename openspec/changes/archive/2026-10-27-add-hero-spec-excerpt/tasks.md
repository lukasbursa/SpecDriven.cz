## 1. Data úryvku

- [x] 1.1 Přidat `repoBlobUrl(path, lines?)` do `src/site.config.ts` a ověřit přes `npm run check`
- [x] 1.2 Napsat `src/lib/spec-excerpt.ts` (`readRequirement()`): výřez požadavku podle názvu, čísla řádků, tokeny podle design.md, chyba s názvem požadavku a souborem, když chybí. Ověřit, že pro „Vysvětlení SDD na první pohled“ vrátí řádky 9–14, a že s dočasně neexistujícím názvem `npm run build` selže s touto chybou

## 2. Komponenta

- [x] 2.1 Vytvořit `src/components/SpecExcerpt.astro` (props: soubor, název požadavku) s markupem podle design.md: `<figure>` s `aria-label`, titulek s cestou, řádky s čísly, `aria-hidden` u čísel a značek Markdownu, odkaz z `repoBlobUrl()`. Ověřit v `dist/index.html`, že text řádků odpovídá souboru a odkaz končí `#L9-L14`
- [x] 2.2 Napsat styly v `@layer components` (Mono, `--surface`, `--line`, `--radius`, barvy tokenů z `tokens.css`, zalamování řádků s odsazením pod textem) a zkontrolovat úryvek ve světlém i tmavém režimu

## 3. Úvodní sekce

- [x] 3.1 Upravit `.hero__inner` v `src/pages/index.astro` na dva sloupce od 64rem a vložit `SpecExcerpt` za scénář. V prohlížeči ověřit na 1280×800, že úryvek je vpravo, nadpis se nezalomil navíc a scénář s odkazem je vidět bez posouvání. Jinak upravit šířku sloupce podle Risks v design.md
- [x] 3.2 Ověřit na 320 px, že úryvek je pod scénářem, řádky se zalamují a stránka nejde vodorovně posouvat
- [x] 3.3 Ověřit ve stromu přístupnosti prohlížeče, že blok má jméno „Ukázka specifikace úvodní stránky“ a text se čte bez `#`, `**`, `-` a čísel řádků

## 4. Dokumentace a kontrola

- [x] 4.1 Doplnit do `CLAUDE.md` (Architektura a záludnosti), že úvodní stránka čte při sestavení požadavek z `openspec/specs/homepage/spec.md` a jeho přejmenování shodí build
- [x] 4.2 Spustit `npm run check`, `npm run build` a `openspec validate add-hero-spec-excerpt --strict` a ověřit, že projdou bez chyb
