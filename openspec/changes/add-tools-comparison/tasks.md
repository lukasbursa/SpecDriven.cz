## 1. Datová vrstva

- [ ] 1.1 Přidat do `src/lib/tools.ts` funkci `getToolIds()` (slugy všech nástrojů včetně konceptů) podle rozhodnutí 3 v design.md. Ověřit, že `npm run check` projde a že `getPublishedTools()` zůstává jediným místem, kde se filtrují koncepty.
- [ ] 1.2 Přidat do `src/lib/articles.ts` funkci `getComparisonArticle()` se slugem `srovnani-nastroju` zapsaným jen tady. Ověřit dočasným konceptem článku s tímto slugem, že funkce vrací `undefined`, a po odstranění `draft` vrací článek.

## 2. Komponenta ComparisonTable

- [ ] 2.1 Vytvořit `src/components/ComparisonTable.astro` podle rozhodnutí 2–4: řádky z `getPublishedTools()`, první sloupec `<th scope="row">` s odkazem na stránku nástroje, sloupce z metadat (`typ`, `licence`, `hvězdy`, `ověřeno`) a ruční sloupce, převod `` `…` `` na `<code>`, `<caption>`. Ověřit na dočasném článku se zkušební tabulkou, že `npm run build` selže s hláškou uvádějící tabulku, sloupec a nástroj postupně pro chybějící hodnotu, prázdný řetězec a neznámý slug. Ověřit, že s hodnotami pro všechny nástroje projde, že hodnota pro koncept nástroje build neshodí a koncept se nezobrazí a že je pořadí řádků stejné jako na `/nastroje/`.
- [ ] 2.2 Doplnit styly ve vrstvě `components` podle rozhodnutí 5: posouvaný obal s `role="region"`, `tabindex="0"` a názvem z `<caption>`, `display: table` místo stylu z `prose.css`, přichycený první sloupec s pozadím `--bg`, viditelné zaměření a přesah šířky do kontejneru na širokých obrazovkách. Ověřit v prohlížeči na šířce 320 px, že se stránka vodorovně neposouvá a první sloupec zůstává vidět, že tabulka jde posouvat šipkami po přechodu klávesou Tab, že v obou barevných režimech nic neprosvítá a kontrast odpovídá WCAG AA a že na 1280 px přesah nerozbije rozvržení. Jinak použít záložní variantu bez přesahu a zapsat to do design.md.

## 3. Obsah článku

- [ ] 3.1 Vytvořit `src/content/articles/srovnani-nastroju.mdx` s perexem a tabulkami Přehled a Cyklus krok za krokem podle osnovy v rozhodnutí 7, s údaji ze stránek nástrojů. Ověřit, že build projde a že každá hodnota v tabulce cyklu odpovídá tabulce „Jak funguje“ na stránce daného nástroje.
- [ ] 3.2 Dopsat sekce Jak vypadá specifikace (včetně jednoho požadavku ve třech zápisech), Ověření, Malé změny a Podporovaná prostředí. Ověřit, že každý údaj jde dohledat na stránce nástroje nebo v oficiálním zdroji odkázaném v textu.
- [ ] 3.3 Napsat sekce Tři přístupy ke specifikaci a Podle čeho vybírat podle rozhodnutí 6 a 7. Ověřit, že žádný nástroj není označen za nejlepší, že každá situace u výběru odkazuje na nástroje, jejichž dokumentace ji uvádí, a že článek zmiňuje, že web vzniká v OpenSpec.

## 4. Ověření faktů

- [ ] 4.1 Ověřit v oficiální dokumentaci Spec Kitu a Kira, jestli slučují specifikace funkcí do souhrnné specifikace systému (otevřená otázka v design.md). Podle výsledku upravit zařazení v sekci Tři přístupy a ve sloupci „Po dokončení práce“. Ověřit, že tvrzení v článku má odkaz na zdroj.
- [ ] 4.2 Projít všechna tvrzení ve sloupcích Ověření a Malé změny, která na stránkách nástrojů nejsou, a ověřit je v oficiální dokumentaci k datu publikace článku. Ověřit, že `pubDate` článku odpovídá dni ověření a perex toto datum uvádí.

## 5. Odkazy na srovnání

- [ ] 5.1 Doplnit do úvodu `src/pages/nastroje/index.astro` větu s odkazem na srovnání přes `getComparisonArticle()`. Ověřit v `dist/nastroje/index.html`, že odkaz vede na `/clanky/srovnani-nastroju/`.
- [ ] 5.2 Doplnit do `src/pages/nastroje/[slug].astro` odstavec s odkazem na srovnání mezi `<Content />` a nadpis „Oficiální odkazy“. Ověřit v `dist/nastroje/gsd-core/index.html`, že odkaz stojí před sekcí „Oficiální odkazy“, a s článkem dočasně označeným jako koncept, že `dist/` neobsahuje na srovnání žádný odkaz (`grep -r srovnani-nastroju dist/`).

## 6. Dokumentace a kontrola

- [ ] 6.1 Doplnit do `CLAUDE.md` komponentu `ComparisonTable` a kontrolu úplnosti a pravidlo, že přidání nástroje nebo změna údajů o něm zahrnuje i srovnání v `srovnani-nastroju.mdx`. Ověřit, že text odpovídá rozhodnutím 3 a 8 v design.md.
- [ ] 6.2 Smazat dočasné zkušební soubory z úkolů 1–2. Ověřit, že `npm run check` a `npm run build` projdou, že `openspec validate add-tools-comparison --strict` je bez chyb a že `/clanky/` ukazuje srovnání jako nejnovější článek a `/rss.xml` ho obsahuje.
