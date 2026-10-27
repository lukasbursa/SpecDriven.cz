## Why

Autor webu dnes neví, kolik lidí web čte, které články zabírají a odkud čtenáři přicházejí. Bez těchto čísel se nedá rozhodnout, kde web propagovat a o čem psát dál. Měření má zajistit Google Analytics 4 (GA4) a má splňovat pravidla pro cookies a ochranu osobních údajů: GA4 ukládá do prohlížeče cookies, které rozlišují uživatele, a podle § 89 odst. 3 zákona č. 127/2005 Sb., o elektronických komunikacích, k tomu potřebuje předchozí souhlas čtenáře.

## What Changes

- Na webu přibude měření návštěvnosti přes GA4 (měřicí ID `G-Z05Q363X59`). Spustí se **až po souhlasu** čtenáře. Do té doby prohlížeč nestáhne nic z domén Googlu a neuloží žádnou cookie.
- Na každé stránce přibude lišta se souhlasem. Tlačítka „Přijmout“ a „Odmítnout“ jsou stejně výrazná, zavření lišty bez volby není souhlas a lišta odkazuje na stránku s podrobnostmi.
- V patičce přibude odkaz „Ochrana osobních údajů“. Na té stránce je tlačítko „Nastavení cookies“, které lištu otevře znovu. Souhlas jde kdykoli odvolat stejně snadno, jako se udělil. Po odvolání web smaže cookies GA4.
- Nová stránka `/ochrana-osobnich-udaju/` popíše, kdo údaje zpracovává, jaké a proč, komu je předává (Google, včetně předání do USA), jak dlouho je uchovává, co web ukládá v prohlížeči a jaká práva čtenář má.
- GA4 poběží bez reklamních funkcí: bez Google signálů a bez personalizace reklam.
- Bez JavaScriptu se lišta ani tlačítko nezobrazí, měření se nespustí a web funguje jako dnes.
- Patička se zkrátí, aby se odkazy i s novým odkazem vešly na šířce 1280 px na jeden řádek: „Tento web byl vytvořen pomocí SDD – OpenSpec“ se změní na „Vytvořeno pomocí OpenSpec“ s odkazem na stránku nástroje na tomto webu místo na GitHub, „Zdrojový kód a specifikace na GitHubu“ na „Kód a specifikace na GitHubu“.
- **BREAKING** (pro specifikaci): požadavek, že prohlížeč nikdy nestahuje soubory z jiné domény než specdriven.cz, se zúží. Bez souhlasu platí dál beze změny, po souhlasu je jedinou výjimkou GA4.
- Texty, které tvrdí, že JavaScript obsluhuje jen přepínač režimu (stránka „Jak vznikl tento web“, `README.md`, `CLAUDE.md`), se upraví podle skutečnosti.

Mimo rozsah: Google Tag Manager a další měřicí nebo reklamní služby, vlastní události nad rámec rozšířeného měření GA4 (to zůstává zapnuté, viz design.md, rozhodnutí 8), Consent Mode v režimu „advanced“ (pingy bez cookies ještě před souhlasem), Google Search Console (nastavuje se přes DNS, web nemění).

## Capabilities

### New Capabilities
- `analytics`: měření návštěvnosti přes GA4 jen se souhlasem, lišta se souhlasem, změna a odvolání souhlasu, chování bez JavaScriptu a stránka „Ochrana osobních údajů“ s odkazy v patičce.

### Modified Capabilities
- `site-layout`: požadavek „Písmo hostované na vlastní doméně“ a jeho scénář „Načtení stránky bez třetích stran“ dostanou výjimku pro GA4 po udělení souhlasu. Požadavek „Jednotná patička“ přidá odkazy z capability `analytics` a patičku na jednom řádku při šířce 1280 px.
- `open-development`: požadavek „Zmínka o SDD v patičce“ se přejmenuje na „Zmínka o OpenSpec v patičce“, text se zkrátí na „Vytvořeno pomocí OpenSpec“ a odkaz povede na `/nastroje/openspec/`.

## Impact

- `src/site.config.ts`: měřicí ID GA4 a název stránky o ochraně údajů.
- Nová komponenta lišty se souhlasem, vložená do `src/layouts/BaseLayout.astro`, a skript, který GA4 načte až po souhlasu. Je to druhý JavaScript na webu, důvodem je souhlas se soubory cookies.
- `src/components/Footer.astro`: odkaz na stránku o ochraně údajů a kratší texty, aby se patička vešla na jeden řádek.
- Nová stránka `src/pages/ochrana-osobnich-udaju.astro`.
- `src/pages/jak-vznikl-tento-web.astro`, `README.md`, `CLAUDE.md`: věty o JavaScriptu a o načítání z cizích domén.
- Externí služba: Google Analytics 4. Nastavení vlastnosti GA4 (doba uchování dat, vypnuté Google signály) se dělá ručně v administraci Googlu, mimo repozitář.
- Souvislost s aktivními změnami `add-seo-metadata` a `add-og-images`: obě sahají na hlavičku stránky (`SeoHead`), tato změna na `BaseLayout` a patičku. Konflikt se nečeká.
