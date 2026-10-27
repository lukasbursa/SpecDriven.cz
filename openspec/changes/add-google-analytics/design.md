## Context

Web je statický výstup Astra a dnes nekontaktuje žádnou cizí doménu. Fonty se stahují při buildu a servírují ze specdriven.cz. JavaScript v prohlížeči obsluhuje jen přepínač barevného režimu: inline skript v `<head>` (`BaseLayout.astro`) uplatní uloženou volbu před vykreslením a modul v `Header.astro` obsluhuje tlačítko, které je bez JavaScriptu `hidden`. Volba se ukládá do `localStorage` pod klíčem `color-scheme`. Nastavení webu je na jednom místě v `src/site.config.ts`. Patička (`Footer.astro`) je na každé stránce včetně 404.

Google k vložení GA4 nabízí úryvek, který stáhne `https://www.googletagmanager.com/gtag/js?id=G-Z05Q363X59` a hned zavolá `gtag('config', …)`. Takový úryvek by GA4 spustil při každém načtení stránky bez ohledu na souhlas. Proto se nepoužije tak, jak je, a jeho obsah se přesune do skriptu, který čeká na souhlas.

Motivaci popisuje proposal.md, požadavky jsou ve specifikacích `analytics` a `site-layout`.

## Goals / Non-Goals

**Goals:**
- Před souhlasem se Google Analytics vůbec nenačte, takže bez souhlasu zůstane chování webu přesně jako dnes.
- Měřicí ID a doména jsou jen v `site.config.ts`.
- Jedna komponenta obsluhuje lištu, tlačítko v patičce i ovládání na stránce o ochraně údajů.
- Žádná nová závislost v `package.json`.

**Non-Goals:**
- Obecná správa souhlasů pro více služeb (kategorie, přepínače pro jednotlivé účely). Web má jen jeden účel, měření návštěvnosti, a jednu službu.
- Synchronizace volby mezi otevřenými záložkami. Nová volba platí od další načtené stránky.
- Právní posudek. Text stránky vychází z oficiálních zdrojů, právní kontrola je na autorovi webu (viz Risks).

## Decisions

### 1. Základní režim souhlasu: GA4 se načte až po souhlasu

Skript `gtag.js` se do stránky vloží až po kliknutí na „Přijmout“ nebo při načtení stránky, když je uložený platný souhlas. Před souhlasem neexistuje `dataLayer` ani žádný požadavek na Google.

Před vložením skriptu se nastaví Consent Mode v2 pro případ, že by GA4 jinak předpokládal souhlas s reklamními účely:

```js
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});
gtag('js', new Date());
gtag('config', MEASUREMENT_ID, {
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});
```

Funkce `gtag` musí do `dataLayer` vkládat objekt `arguments`, ne pole (`function gtag() { dataLayer.push(arguments); }`). `gtag.js` pole z rest parametru nezpracuje a měření tiše nefunguje. Protože skript je TypeScript modul, potřebuje tahle funkce komentář s důvodem, jinak ji někdo „opraví“ na `(...args)`.

Alternativa: Consent Mode v režimu „advanced“, kdy se `gtag.js` načte vždy a bez souhlasu posílá pingy bez cookies. Google z nich dopočítává modelovaná data. Odmítnuto: posílá data Googlu i čtenářům, kteří měření odmítli, porušilo by to požadavek na načtení bez třetích stran a právní výklad pingů bez souhlasu je sporný.

### 2. Komponenta `ConsentBanner.astro` vložená hned za odkaz „Přeskočit na obsah“

Komponenta obsahuje lištu (ve výchozím stavu `hidden`) a modul `<script>`, který Astro zabalí do souboru v `_astro/`. Skript se tedy servíruje ze specdriven.cz. Hodnoty bere importem ze `site.config.ts`, stejně jako komponenty.

Lišta není inline skript v `<head>` jako přepínač režimu. Nemusí platit před vykreslením: když se objeví o chvíli později, nic nebliká, protože je `position: fixed` u dolního okraje a neposouvá obsah.

Pořadí v DOM: odkaz „Přeskočit na obsah“, lišta, hlavička. Klávesnicí se tak k liště dostane čtenář hned, nemusí projít celou stránku. Lišta nemá `role="dialog"` ani nepřebírá zaměření, protože čtení nemá blokovat. Je to `<section>` s `aria-labelledby` na krátký nadpis „Cookies a měření návštěvnosti“. Nadpis není `<h2>` s dekorativním prefixem: použije se `<p>` se `id`, aby lišta nezasahovala do osnovy nadpisů stránky.

Aby lišta nezakryla konec stránky (patičku i tlačítko „Nastavení cookies“), skript při zobrazení zapíše výšku lišty do proměnné `--consent-height` na `<html>` a sleduje ji přes `ResizeObserver`. CSS z ní nastaví `padding-bottom` na `body` a `scroll-padding-bottom` na `html`, aby zaměřený prvek nezůstal pod lištou (WCAG 2.4.11). Po skrytí lišty se proměnná smaže.

Alternativa: lišta nahoře, staticky v toku stránky. Nic by nezakrývala, ale bez inline skriptu v `<head>` by se objevila až po vykreslení a posunula by celou stránku dolů. Inline skript by kvůli tomu musel znát stav souhlasu. Odmítnuto jako zbytečně složité.

### 3. Volba v `localStorage` pod klíčem `analytics-consent`

Hodnota je JSON `{"value": "granted" | "denied", "date": "YYYY-MM-DD"}`. Volba platí 12 měsíců od `date`. Neplatný nebo starší záznam skript smaže a lištu zobrazí znovu. Je to stejné úložiště jako u přepínače režimu: nic se neposílá na server a stránka o ochraně údajů popíše obě položky vedle sebe.

Volba se ukládá i při odmítnutí, jinak by se lišta zobrazovala na každé stránce. Uložení vlastní volby souhlasu je nezbytné pro funkci, o kterou čtenář požádal, a souhlas nevyžaduje.

Zablokované úložiště (`localStorage` vyhodí výjimku): volba platí jen na aktuální stránce a na další se lišta zobrazí znovu. GA4 se v takovém prohlížeči po načtení další stránky nespustí, protože uložený souhlas nejde přečíst.

Alternativa: vlastní cookie se souhlasem. Prohlížeč by ji posílal s každým požadavkem na server, kde k ničemu není. Odmítnuto.

### 4. Odvolání souhlasu bez obnovení stránky

Po „Odmítnout“ v situaci, kdy GA4 na stránce běží, skript:
1. zavolá `gtag('consent', 'update', { analytics_storage: 'denied' })`, takže GA4 přestane zapisovat cookies a posílat data,
2. smaže všechny cookies `_ga` a `_ga_*`. GA4 je ve výchozím nastavení ukládá na nejvyšší možnou doménu (`.specdriven.cz`), proto se maže s `domain=.specdriven.cz` i bez `domain`, vždy s `path=/` a datem v minulosti,
3. uloží volbu `denied`.

Stránka se neobnovuje. Další stránky už `gtag.js` nenačtou.

Stránka obnovená tlačítkem Zpět (bfcache) nespustí skript znovu a mohla by mít starý stav. Skript proto na `pageshow` s `persisted` znovu přečte volbu: když mezitím vznikl `denied`, provede kroky 1 a 2. Stejný postup už používá přepínač režimu.

### 5. Měří se jen na produkční doméně

Skript GA4 načte jen tehdy, když se `location.hostname` shoduje s hostitelem z `site.url`. Lokální `npm run dev` ani `npm run preview` tak data do GA4 nepošlou a lištu lze testovat, aniž by se do statistik dostal autor. Kontrola podle domény je spolehlivější než `import.meta.env.PROD`, protože `preview` je produkční build.

### 6. Tlačítka „Nastavení cookies“ přes atribut `data-consent-open`

Tlačítko v patičce i ovládání na stránce o ochraně údajů jsou `<button type="button" data-consent-open hidden>`. Skript lišty je najde, odkryje a po kliknutí zobrazí lištu. Bez JavaScriptu zůstanou skrytá. Na stránce `/ochrana-osobnich-udaju/` je navíc vedle tlačítka text s aktuálním stavem („Měření je povolené.“ / „Měření je odmítnuté.“ / „Zatím jste nezvolili.“), který skript vyplní do prvku s atributem `data-consent-state`. Bez JavaScriptu stránka místo toho napíše, že bez JavaScriptu se nic neměří.

### 7. Stránka `/ochrana-osobnich-udaju/` jako `.astro` stránka

Je to `src/pages/ochrana-osobnich-udaju.astro`, stejně jako `jak-vznikl-tento-web.astro`, ne položka kolekce obsahu. Je jen jedna a vkládá ovládání souhlasu. Text se sází třídou `prose`. Datum poslední změny je konstanta v souboru a vypíše se přes `src/lib/dates.ts`. Stránka je v sitemapě.

Osnova (nadpisy `##`):
1. **Kdo údaje zpracovává**: správce Lukáš Burša, kontakt info@lukasbursa.cz jako odkaz `mailto:`. Adresa je v `site.config.ts` (`site.contactEmail`), stránka ji odtud jen vypíše.
2. **Měření návštěvnosti**: GA4, jen se souhlasem. Zpracovávané údaje: náhodný identifikátor prohlížeče v cookie, navštívené stránky, odkud čtenář přišel, typ zařízení a prohlížeče, přibližná poloha odvozená z IP adresy. Právní základ: souhlas podle čl. 6 odst. 1 písm. a) GDPR a pro uložení cookies § 89 odst. 3 zákona č. 127/2005 Sb. Bez Google signálů a personalizace reklam.
3. **Komu údaje předáváme**: Google Ireland Limited jako zpracovatel. Předání do USA společnosti Google LLC, která je certifikovaná v rámci EU-U.S. Data Privacy Framework (odkaz na záznam na dataprivacyframework.gov).
4. **Jak dlouho**: cookies `_ga` a `_ga_Z05Q363X59` 2 roky ([dokumentace Googlu](https://support.google.com/analytics/answer/11397207?hl=cs)), údaje na úrovni uživatelů a událostí v GA4 14 měsíců, což je nejdelší možnost u standardní vlastnosti ([dokumentace Googlu](https://support.google.com/analytics/answer/7667196)).
5. **Co web ukládá ve vašem prohlížeči**: tabulka s položkami `_ga`, `_ga_Z05Q363X59` (cookie, jen se souhlasem), `analytics-consent` a `color-scheme` (`localStorage`, nezbytné, neodesílají se).
6. **Provoz webu**: obecná formulace bez délky uchování, protože ji autor nezná. Poskytovatel hostingu může kvůli provozu a bezpečnosti vést technické záznamy o přístupech (například IP adresu, čas a adresu stránky). Konkrétní firmu stránka zatím nejmenuje (viz Open Questions). Odkazy na GitHub jsou jen odkazy, údaje zpracuje GitHub až po kliknutí podle svých zásad.
7. **Změna nebo odvolání souhlasu**: tlačítko a text se stavem (rozhodnutí 6).
8. **Vaše práva**: přístup, oprava, výmaz, omezení zpracování, přenositelnost, námitka, odvolání souhlasu, stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz), s odkazy na články GDPR.
9. **Datum poslední změny**.

Tón je věcný jako zbytek webu: žádné „vaše soukromí je pro nás prioritou“, jen co se děje a proč.

### 8. Nastavení v administraci GA4 (mimo repozitář)

Část chování určuje nastavení vlastnosti, ne kód. Před nasazením se v administraci GA4 nastaví:
- doba uchování dat 14 měsíců. Souhrnné přehledy návštěvnosti a zdrojů na ní nezávisí, delší doba dovolí v Průzkumech srovnat rok s rokem. Kratší možnost (2 měsíce) by šetrnost ke čtenářům zvýšila jen málo, protože se měří až se souhlasem,
- vypnuté Google signály a sdílení dat s produkty Googlu,
- přijaté podmínky zpracování dat (Data Processing Terms), aby byl Google v roli zpracovatele, jak to popisuje stránka,
- volitelně vypnutý sběr přesné polohy a údajů o zařízení pro oblast EU.

Stránka o ochraně údajů musí s tímto nastavením souhlasit. Proto patří do úkolů ručně odškrtávaný krok s kontrolou.

### 9. Texty o JavaScriptu a cizích doménách

`README.md`, `CLAUDE.md` a stránka „Jak vznikl tento web“ dnes říkají, že JavaScript obsluhuje jen přepínač režimu a web nic nenačítá z cizích domén. Nově: JavaScript obsluhuje přepínač režimu a lištu se souhlasem, GA4 se načte jen se souhlasem a web bez JavaScriptu funguje dál, jen nic neměří. `CLAUDE.md` dostane krátký odstavec o komponentě lišty, klíči `analytics-consent`, kontrole domény a o tom, proč `gtag` používá `arguments`.

## Risks / Trade-offs

- **[Čísla budou podhodnocená]** Část čtenářů souhlas odmítne a blokátory reklam `gtag.js` často zablokují. U technického publika to může být velká část návštěv. → Přijato jako cena za měření se souhlasem. Pro hledanost doplní obraz Google Search Console, která nic na webu nevyžaduje.
- **[Právní výklad]** Text stránky a podoba lišty vychází ze zákona, GDPR a dokumentace Googlu, ale není to právní rada. → Před nasazením nechat stránku a lištu zkontrolovat, pokud web začne sloužit podnikání. Datum poslední změny na stránce ukáže, kdy byl text naposledy aktualizován.
- **[Platnost Data Privacy Framework]** Předání do USA stojí na rozhodnutí Evropské komise z roku 2023, které může soud zrušit, jako se to stalo jeho předchůdcům. → Stránka uvádí rámec s odkazem a datem. Když se rámec změní, aktualizuje se text stránky.
- **[Lišta zakrývá obsah na malém displeji]** Na šířce 320 px může mít lišta tři až čtyři řádky. → Krátký text, tlačítka vedle sebe a `padding-bottom` podle skutečné výšky (rozhodnutí 2). Ověří se na 320 px.
- **[Google změní názvy cookies]** Mazání při odvolání by pak minulo nové cookies. → Maže se podle předpony `_ga`, kterou Google používá od GA4. Při změně dokumentace se upraví mazání i tabulka na stránce.
- **[Starý stav po návratu Zpět]** Viz rozhodnutí 4. → Kontrola na `pageshow`.

## Migration Plan

1. Před nasazením nastavit vlastnost GA4 podle rozhodnutí 8.
2. Nasadit pushem do `main`.
3. Na produkci ověřit scénáře v panelu Síť nástrojů pro vývojáře: první návštěva bez požadavků na Google a bez cookies `_ga`, po „Přijmout“ požadavky na Google a zobrazení v přehledu GA4 „Real-time“, po odvolání žádná cookie `_ga` a žádné další požadavky.
4. Vrácení: revert commitu a nové nasazení. Čtenářům, kteří souhlas udělili, zůstanou cookies `_ga` až do vypršení, web je ale nečte ani neposílá.

## Open Questions

- Rozsah a doba uchování záznamů o přístupech na hostingu nejsou známé, proto stránka zatím používá obecnou formulaci (rozhodnutí 7, bod 6). Až to Subreg potvrdí, doplní se to opravou textu stránky. Do té doby stránka nejmenuje konkrétní firmu, aby neuváděla neověřený údaj.
