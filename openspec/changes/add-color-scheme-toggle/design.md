## Context

Všechny barvy webu jsou v `src/styles/tokens.css` zapsané přes `light-dark()`. Funkce nečte `prefers-color-scheme` přímo, ale vlastnost `color-scheme` prvku. Dnes je na `:root` nastavená na `light dark`, takže rozhoduje systém. Pro prohlížeče bez `light-dark()` má `tokens.css` zálohu jen ve světlé variantě. Komponenty barvy natvrdo nepíšou. Výjimkou je `public/favicon.svg` s vlastním `@media (prefers-color-scheme: dark)`.

Hlavička (`src/components/Header.astro`) je flexbox s `flex-wrap` a `space-between`: na široké obrazovce je název webu vlevo a navigace vpravo, na úzké se navigace zalomí pod název. Prvky hlavičky mají výšku alespoň 44 px.

Web je statický a má víc stránek. Volbu, která má přežít přechod mezi stránkami, si tedy musí pamatovat prohlížeč a uplatnit ji musí skript. Žádná stránka zatím JavaScript nemá. Požadavky vychází ze specifikace `site-layout`, požadavek „Světlý a tmavý režim“.

## Goals / Non-Goals

**Goals:**
- Přepnutí nemění žádnou barvu ani token, mění jen `color-scheme` na kořenovém prvku.
- Skriptu, který blokuje vykreslení, je co nejméně: jen přečtení volby a nastavení atributu.
- Selhání skriptu (vypnutý JS, chyba, zablokované úložiště) nikdy nerozbije zobrazení, nejvýš chybí tlačítko nebo se volba nezapamatuje.

**Non-Goals:**
- Synchronizace volby mezi otevřenými záložkami (událost `storage`). Ostatní záložky se srovnají při dalším načtení.
- Přepínání favicony podle ruční volby. Ikona je v liště prohlížeče, která se řídí systémem, ne stránkou.

## Decisions

### 1. Atribut `data-theme` na `<html>` přepíná jen `color-scheme`

```css
/* tokens.css, vedle stávajícího :root { color-scheme: light dark; } */
:root[data-theme='light'] { color-scheme: light; }
:root[data-theme='dark']  { color-scheme: dark; }
```

Bez atributu platí `light dark` a rozhoduje systém, tedy dnešní chování. Atribut se nastaví jen tehdy, když čtenář zvolil variantu odlišnou od systému. Pravidla jsou v `tokens.css` mimo vrstvy jako stávající `:root`, takže je vrstvy komponent nepřebijí. Externí CSS blokuje vykreslení, takže pravidla platí od prvního vykreslení.

`<meta name="color-scheme" content="light dark">` v `BaseLayout.astro` zůstává. Vlastnost `color-scheme` na kořenovém prvku má přednost a meta platí jen pro chvíli před načtením CSS.

*Alternativa:* zdvojit hodnoty tokenů pod `[data-theme='dark']` a `@media (prefers-color-scheme: dark)`. Každá barva by tak byla na třech místech. `light-dark()` to už řeší jedním řádkem.

### 2. Uložení: `localStorage`, klíč `color-scheme`

Hodnota je `light` nebo `dark`. Chybějící klíč znamená „podle systému“. Cookie nedává smysl, server je statický a nečte ji. Volba se nikam neposílá. Ukládá se jen nastavení, o které si čtenář sám řekl, a to souhlas nevyžaduje.

Každý přístup k `localStorage` je v `try/catch`. V prohlížeči se zablokovaným úložištěm (např. některé anonymní režimy) přepnutí funguje na aktuální stránce, jen se nezapamatuje.

### 3. Dva skripty: inline v `<head>` a modul v hlavičce

```
<head>
  <style is:inline>@layer …</style>      ← zůstává první
  <script is:inline>                      ← nové, synchronní, ~200 B
    přečti localStorage → nastav data-theme na <html>
  </script>
  … CSS, fonty, SEO
</head>
<body>
  <header> … <button hidden> … </header>
  <script type="module"> obsluha tlačítka </script>   ← modul, spustí se po načtení
```

Inline skript musí běžet před vykreslením. Běžný `<script>` v Astru je modul a spouští se až po načtení dokumentu, stránka by tedy na okamžik ukázala systémovou variantu. Proto `is:inline`. Skript jen nastaví atribut, žádnou logiku navíc nemá a nemění pořadí ostatního obsahu `<head>`.

Obsluha tlačítka (výpočet stavu, klik, sledování systému) je běžný `<script>` komponenty. Astro ho zpracuje jako modul. Skripty menší než 4 kB nedává do `_astro/`, ale vloží je do stránky jako `<script type="module">` (tady asi 0,8 kB). Modul se spouští až po načtení dokumentu, takže vykreslení neblokuje.

*Alternativa:* celou logiku dát do inline skriptu v `<head>`. Prodlužovala by blokující část `<head>` a běžela by dřív, než existuje tlačítko.

### 4. Logika přepnutí a návrat k systému

```
systém  = matchMedia('(prefers-color-scheme: dark)') ? dark : light
aktivní = uložená volba ?? systém

klik:   nová = opak(aktivní)
        nová == systém  → smaž klíč, odeber data-theme   (zase podle systému)
        jinak           → ulož nová, data-theme = nová

změna systému (matchMedia 'change'):
        bez uložené volby → jen překresli tlačítko (barvy přepne CSS samo)

návrat z bfcache (pageshow, persisted):
        znovu přečti uloženou volbu a nastav data-theme
```

Aktivní variantu skript odvozuje z atributu `data-theme`, ne přímo z úložiště. Při zablokovaném `localStorage` tak přepnutí na aktuální stránce funguje dál. Stránku, na kterou se čtenář vrátí tlačítkem Zpět, prohlížeč obnoví z mezipaměti (bfcache) bez spuštění inline skriptu. Mezitím ale mohl volbu změnit na jiné stránce, proto se při obnovení přečte znovu.

Tím odpadá třetí stav „podle systému“. Kdo nikdy neklikne, zůstane na systému. Kdo se proklikne zpátky na systémovou variantu, vrátí se k ní, aniž by o tom musel vědět.

### 5. Tlačítko: stálý název, stav v `aria-pressed`, ikona ukazuje cíl

```html
<button type="button" class="theme-toggle" aria-label="Tmavý režim"
        aria-pressed="false" title="Přepnout na tmavý režim" hidden>
  <svg class="theme-toggle__moon" aria-hidden="true">…</svg>
  <svg class="theme-toggle__sun"  aria-hidden="true">…</svg>
</button>
```

- Přístupný název je stálý („Tmavý režim“) a stav nese `aria-pressed`. Čtečka hlásí „Tmavý režim, přepínací tlačítko, stisknuto/nestisknuto“. Kdyby se měnil název, čtečka by ohlásila jen nový text bez stavu.
- Viditelnou ikonu vybírá CSS podle `aria-pressed`: ve světlé variantě měsíc, v tmavé slunce. Ikona tedy ukazuje variantu, na kterou se kliknutím přepne. `title` to řekne slovy a skript ho mění spolu se stavem.
- Ikony jsou inline SVG s `stroke="currentColor"` ve stylu ikony v názvu webu. Barva je `--ink`, při najetí `--accent`, stejně jako odkazy v navigaci. Indikátor zaměření je globální `:focus-visible` z `base.css`.
- Rozměr 44 × 44 px.
- Atribut `hidden` odebere modul, a to jen v prohlížeči, který umí `light-dark()` (`CSS.supports('color', 'light-dark(#000, #fff)')`). Ve starším prohlížeči by volba tmavé varianty nic neudělala, protože záloha v `tokens.css` je jen světlá.

*Alternativa:* `role="switch"` s `aria-checked`. Podpora ve čtečkách je slabší než u `aria-pressed` a ve výsledku znamená totéž.

### 6. Rozložení hlavičky

Tlačítko je v DOM za `<nav>`, ne uvnitř. Není to odkaz navigace a na široké obrazovce tak přirozeně uzavře řádek. `.header__inner` přejde z flexboxu na grid s pojmenovanými oblastmi:

```
široká:    [ název ][ ………… ][ navigace ][ ☾ ]
úzká:      [ název ][ ……………………………… ][ ☾ ]
           [ navigace (zalomená)              ]
```

Na úzké obrazovce je tlačítko vizuálně v první řadě, ale v pořadí zaměření je až za navigací. Pořadí zaměření tím neztrácí smysl (WCAG 2.4.3): tlačítko je nezávislé na odkazech a na široké obrazovce, kde se klávesnice používá nejvíc, odpovídá vizuálnímu pořadí.

Grid oblasti podle délky obsahu sám nepřeskládá, rozložení se proto přepíná media query. Bod zlomu je v `rem`, aby se posunul s velikostí písma, kterou si čtenář nastavil v prohlížeči. Hodnota se odvodí ze změřené šířky názvu, navigace a tlačítka v jednom řádku. Kdyby navigace později zesílila a do bodu zlomu se nevešla, nepřeteče: její seznam se zalomí uvnitř své oblasti.

*Alternativa:* zachovat flexbox a tlačítko umístit absolutně do pravého horního rohu s rezervovaným odsazením. Zalamovalo by se podle obsahu, ale rezervované místo by na úzké obrazovce ubíralo šířku i druhé řadě s navigací.

*Alternativa:* tlačítko v DOM hned za názvem webu. Pořadí by sedělo na mobilu, ale nesedělo by na široké obrazovce.

### 7. Texty o JavaScriptu

Věty „v prohlížeči neběží žádný JavaScript“ (`src/pages/jak-vznikl-tento-web.astro`, `README.md`) a „zatím ho žádná stránka nepoužívá, barevný režim se řídí jen systémem“ (`CLAUDE.md`) se nahradí poctivým popisem: JavaScript jen pro přepínač barevného režimu, web funguje i bez něj. Komentář v hlavičce `tokens.css` doplní, že režim jde přepnout atributem `data-theme`.

## Risks / Trade-offs

- [Web přestane být „bez JavaScriptu“, a to je jedna z věcí, kterými se dosud prezentoval] → Skript je malý, volitelný a bez něj web funguje beze změny. Texty to řeknou otevřeně.
- [Chyba v inline skriptu v `<head>` by se projevila na každé stránce] → Celý skript je v `try/catch` a nic jiného než nastavení atributu nedělá. Při chybě platí systémová varianta.
- [Výška hlavičky se po odkrytí tlačítka změní, obsah poskočí] → Tlačítko není vyšší než ostatní prvky hlavičky (44 px) a sedí v první řadě vedle názvu webu, takže výška řádků zůstane stejná.
- [Na úzké obrazovce se vizuální pořadí liší od pořadí zaměření] → Viz rozhodnutí 6, přijatý kompromis.

## Migration Plan

Žádná migrace dat. Nasazení proběhne běžným pushem do `main`. Návrat zpět znamená revert commitu: po něm se uložený klíč v prohlížečích čtenářů prostě přestane číst a web se znovu řídí systémem.
