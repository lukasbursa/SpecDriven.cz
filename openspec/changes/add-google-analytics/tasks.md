## 1. Nastavení

- [x] 1.1 Přidat do `src/site.config.ts` objekt `analytics` s měřicím ID `G-Z05Q363X59` , cestu stránky `/ochrana-osobnich-udaju/` (`privacyPath`) a kontakt na správce `contactEmail: 'info@lukasbursa.cz'`. Ověřit přes `npm run check`

## 2. Lišta se souhlasem

- [x] 2.1 Vytvořit `src/components/ConsentBanner.astro`: `<section hidden aria-labelledby>` s krátkým textem, odkazem na `/ochrana-osobnich-udaju/` a tlačítky „Přijmout“ a „Odmítnout“ se stejným stylem. Styly ve `@layer components`, tokeny z `tokens.css`, `position: fixed` u dolního okraje. Vložit do `BaseLayout.astro` hned za odkaz „Přeskočit na obsah“. Ověřit přes `npm run check` a v `dist/index.html`, že lišta je v HTML s atributem `hidden`
- [x] 2.2 Napsat skript lišty: čtení a zápis `analytics-consent` v `localStorage` (JSON s `value` a `date`, platnost 12 měsíců, ošetřené zablokované úložiště), zobrazení lišty bez platné volby, `--consent-height` přes `ResizeObserver` a CSS pro `padding-bottom` a `scroll-padding-bottom` podle rozhodnutí 2 a 3 v design.md. Ověřit v prohlížeči: lišta se zobrazí, po volbě zmizí a po smazání záznamu se zobrazí znovu. Se záznamem starším 12 měsíců se zobrazí také
- [x] 2.3 Napsat načtení GA4 podle rozhodnutí 1 a 5: `dataLayer`, `gtag` s `arguments` (s komentářem proč), výchozí Consent Mode, `config` bez Google signálů a personalizace reklam a vložení `gtag.js`. Spustí se jen na hostiteli ze `site.url`, a to po „Přijmout“ nebo při načtení s platným souhlasem. Ověřit na `localhost`, že ani po „Přijmout“ nevznikne požadavek na doménu Googlu (scénář „Lokální vývoj“). Dočasným povolením `localhost` ověřit, že po „Přijmout“ odejde požadavek `collect` na Google Analytics. Povolení vrátit
- [x] 2.4 Napsat odvolání podle rozhodnutí 4: `consent update` na `denied`, smazání cookies `_ga` a `_ga_*` s doménou `.specdriven.cz` i bez ní a kontrola na `pageshow` s `persisted`. Ověřit s dočasně povoleným `localhost` (cookies se tam ukládají bez domény), že po „Odmítnout“ nezůstane žádná cookie `_ga` a nové požadavky na Google nevznikají. Povolení vrátit
- [x] 2.5 Ověřit přístupnost lišty: Tab po načtení zaměří „Přeskočit na obsah“, potom odkaz a tlačítka lišty a pak hlavičku, čtečka (VoiceOver) oznámí název lišty a obě tlačítka, kontrast podle WCAG AA ve světlém i tmavém režimu, na šířce 320 px bez vodorovného posouvání a patička jde na konci stránky přečíst celá

## 3. Patička a ovládání souhlasu

- [x] 3.1 Přidat do `Footer.astro` odkaz „Ochrana osobních údajů“ a tlačítko „Nastavení cookies“ (`data-consent-open`, `hidden`) podle rozhodnutí 6. Skript lišty tlačítka odkryje a po kliknutí lištu zobrazí. Ověřit scénáře „Odvolání souhlasu“ a „Dodatečný souhlas“ a na stránce 404, že patička obsahuje oba prvky
- [x] 3.2 Ověřit scénář „Vypnutý JavaScript“: v prohlížeči s vypnutým JavaScriptem není vidět lišta ani tlačítko „Nastavení cookies“, odkaz „Ochrana osobních údajů“ funguje a panel Síť neukazuje žádnou cizí doménu

## 4. Stránka „Ochrana osobních údajů“

- [x] 4.1 Vytvořit `src/pages/ochrana-osobnich-udaju.astro` s osnovou podle rozhodnutí 7: odkazy na dokumentaci Googlu u cookies a doby uchování, tabulka položek v prohlížeči, ovládání souhlasu s textem o aktuálním stavu (`data-consent-state`) a varianta bez JavaScriptu, datum poslední změny přes `src/lib/dates.ts`. Kontakt na správce jako odkaz `mailto:` ze `site.contactEmail`, sekce o hostingu s obecnou formulací bez názvu firmy a bez délky uchování. Ověřit přes `npm run build`, že stránka je v `dist/ochrana-osobnich-udaju/index.html` a v sitemapě a má titulek „Ochrana osobních údajů | SpecDriven.cz“
- [x] 4.2 Ověřit scénáře „Čtenář chce vědět, co se měří“, „Odvolání ze stránky“ a „Odkaz z lišty“ a vzhled stránky ve světlém i tmavém režimu a na šířce 320 px

## 5. Dokumentace

- [x] 5.1 Upravit věty o JavaScriptu a cizích doménách v `README.md`, `src/pages/jak-vznikl-tento-web.astro` a `CLAUDE.md` podle rozhodnutí 9. Do `CLAUDE.md` doplnit odstavec o `ConsentBanner.astro`, klíči `analytics-consent`, kontrole domény a `gtag` s `arguments`. Ověřit, že `grep -rn "jen přepínač" README.md CLAUDE.md src/` nic nevrátí

## 6. Ověření a nasazení

- [x] 6.1 Spustit `npm run check` a `npm run build` bez chyb. V `dist/` ověřit, že žádné HTML nemá atribut `src` ani `href` s doménou Googlu, která by se načetla sama (`grep -rhoE '(src|href)="https?://[^"]*google[^"]*"' dist --include='*.html'` najde jen odkazy na dokumentaci na stránce o ochraně údajů). Adresa `gtag.js` smí být jen jako text uvnitř skriptu lišty
- [x] 6.2 Ručně v administraci GA4 nastavit dobu uchování dat na 14 měsíců, vypnout Google signály, personalizaci reklam a sdílení dat, nechat zapnuté rozšířené měření a přijmout podmínky zpracování dat podle rozhodnutí 8. Ověřit, že hodnoty souhlasí s textem stránky `/ochrana-osobnich-udaju/`
- [ ] 6.3 Po nasazení ověřit na https://specdriven.cz kroky 3 z Migration Plan v design.md: bez souhlasu žádný požadavek na Google a žádná cookie `_ga`, po souhlasu návštěva v přehledu GA4 „Real-time“, po odvolání žádná cookie `_ga`

## 7. Patička na jeden řádek

- [x] 7.1 Odebrat tlačítko „Nastavení cookies“ z `Footer.astro`, zkrátit texty na „Vytvořeno pomocí SDD – OpenSpec“ a „Kód a specifikace na GitHubu“ a dát odkazy, „Ochrana osobních údajů“ a „© <rok> <autor>“ do jednoho řádku. Z `ochrana-osobnich-udaju.astro` odebrat větu, že tlačítko je i v patičce. Upravit odstavec v `CLAUDE.md`. Ověřit přes `npm run check` a `npm run build`
- [x] 7.2 Ověřit v prohlížeči scénáře „Patička na jednom řádku“ (1280 px, světlý i tmavý režim), „Odvolání souhlasu“ a „Dodatečný souhlas“ přes stránku `/ochrana-osobnich-udaju/`, zalomení patičky na 320 px bez vodorovného posunu a že patička nemá tlačítko „Nastavení cookies“
- [x] 7.3 Změnit první část patičky na „Vytvořeno pomocí OpenSpec“ s odkazem na stránku nástroje přes `getPublishedTools()` a `toolPath()`, záložně na `site.openspecUrl`. Ověřit v `dist/index.html`, že odkaz vede na `/nastroje/openspec/`, a v prohlížeči, že patička na 1280 px zůstává na jednom řádku

## 8. Oprava po ověření na produkci

- [x] 8.1 Ověření 6.3 na produkci ukázalo, že po odvolání načtený `gtag.js` dál posílá události bez cookies (`gcs=G100`). Doplnit do odvolání vypínač `window['ga-disable-<ID>'] = true` a při novém souhlasu ho vrátit na `false` (design.md, rozhodnutí 4). Ověřeno lokálně se zaznamenáváním všech požadavků na Google: po odvolání neodejde žádná událost ani při posunutí a přechodu na další stránku, po novém souhlasu na téže stránce se měří znovu
