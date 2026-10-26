## 1. Kolekce a datová vrstva

- [x] 1.1 Přidat kolekci `tools` do `src/content.config.ts` podle design.md (enum typů, `refine` pro website/repository a pro stars bez repository) a jeden zkušební nástroj v `src/content/tools/`. Ověřit, že `npm run build` selže s hláškou uvádějící soubor postupně pro chybějící `verifiedDate`, nástroj bez `website` i `repository`, `stars` bez `repository` a neznámý typ, a s platnými daty projde.
- [x] 1.2 Vytvořit `src/lib/tools.ts` s `getPublishedTools()` (bez konceptů, řazení: hvězdy sestupně, bez hvězd na konci, při shodě abecedně), `toolPath()` a `formatStars()`. Ověřit dočasnými testovacími nástroji pořadí ze scénářů „Pořadí podle hvězd“ a „Komerční nástroje na konci“ a formát „143 024“ s nezlomitelnou mezerou.

## 2. Stránky nástrojů

- [x] 2.1 Vyjmout blok metadat ze `src/pages/clanky/[slug].astro` do `src/components/Frontmatter.astro`. Ověřit porovnáním `dist/clanky/co-je-spec-driven-development/index.html` před a po, že se stránka článku nezměnila (stejné prvky, texty a třídy).
- [x] 2.2 Vytvořit `src/pages/nastroje/[slug].astro`: cesta `nastroje / <slug>`, blok metadat (typ, licence, hvězdy, ověřeno, publikováno, aktualizováno), obsah, generovaná sekce „Oficiální odkazy“ a kontrola nadpisu „Jak funguje“. Ověřit, že zkušební nástroj má stránku se všemi částmi, že nástroj bez sekce „Jak funguje“ shodí build s hláškou uvádějící nástroj a že koncept nemá v `dist/` stránku.
- [x] 2.3 Vytvořit `src/components/ToolCards.astro` a stránku `src/pages/nastroje/index.astro` s nadpisem „Nástroje pro spec-driven development“ a úvodem o řazení. Ověřit v prohlížeči, že přehled ukazuje u každého nástroje název, typ, popis, hvězdy nebo „bez veřejného repozitáře“ a datum ověření a že se na šířce 320 px nic neposouvá vodorovně.

## 3. Napojení na web

- [x] 3.1 Přidat sekci „Nástroje pro SDD“ do `src/pages/index.astro` mezi cyklus a nejnovější články (nejvýše 6 karet, odkaz „Všechny nástroje →“). Ověřit s dočasně osmi nástroji, že se zobrazí šest nejpopulárnějších, že karty na 320 px jdou pod sebou a že se nástroje neobjevují v „Nejnovějších článcích“ ani v `/clanky/`.
- [x] 3.2 Přidat odkaz „Nástroje“ do `src/components/Header.astro` mezi „Články“ a „Jak vznikl tento web“. Ověřit, že na `/nastroje/` má odkaz `aria-current="page"`, na `/nastroje/<slug>/` `aria-current="true"` a že se navigace na 320 px vejde.
- [x] 3.3 Sloučit články a nástroje v `src/pages/rss.xml.ts` (řazení podle `pubDate`, název feedu „SpecDriven.cz“). Ověřit v `dist/rss.xml`, že obsahuje články i nástroje a že odkaz nástroje je absolutní, např. `https://specdriven.cz/nastroje/openspec/`.
- [x] 3.4 Ověřit SEO stránek nástrojů v `dist/`: titulek „<název> | SpecDriven.cz“, meta popis z `description`, `og:type` = `article`, kanonická URL s lomítkem a přítomnost `/nastroje/` i stránek nástrojů v sitemap (koncepty ne).

## 4. Obsah

U každého nástroje ověřit údaje v oficiální dokumentaci a hvězdy přes GitHub API ke dni zápisu, vyplnit `verifiedDate` a dodržet osnovu z design.md. Úkol je hotový, když stránka projde buildem a každé tvrzení o nástroji jde dohledat v oficiálních odkazech na stránce.

- [x] 4.1 Napsat `src/content/tools/spec-kit.md`
- [x] 4.2 Napsat `src/content/tools/openspec.md` včetně zmínky a odkazu na „Jak vznikl tento web“
- [x] 4.3 Napsat `src/content/tools/bmad-method.md` (licenci zjistit ze souboru LICENSE, oficiální web ověřit)
- [x] 4.4 Napsat `src/content/tools/agent-os.md`
- [x] 4.5 Napsat `src/content/tools/kiro.md` (bez `repository` a `stars`)
- [x] 4.6 Napsat `src/content/tools/gsd-core.md` (hvězdy repozitáře `open-gsd/gsd-core`, ne archivovaného `gsd-build/get-shit-done`). Tessl byl z první dávky vyřazen, viz proposal.md
- [x] 4.7 Smazat zkušební a dočasné nástroje z úkolů 1–3. Ověřit, že `/nastroje/` ukazuje přesně šest nástrojů v pořadí Spec Kit, OpenSpec, BMAD-METHOD, GSD Core, Agent OS, Kiro (podle aktuálních hvězd).
- [x] 4.8 Upravit sekci „Nástroje“ v úvodním článku: odkazy na stránky nástrojů na webu a na `/nastroje/` místo cizích odkazů, bez věty o tom, že web nástroje neporovnává. Ověřit, že každý odkaz vede na existující stránku v `dist/`.

## 5. Kontext a dokumentace

- [x] 5.1 Zkontrolovat úpravu tónu v `openspec/config.yaml` (věcný a informativní, bez seznamu první vlny) a ověřit přes `openspec instructions proposal --change add-tool-pages --json`, že nový text je v poli `context`.
- [x] 5.2 Doplnit do `CLAUDE.md` kolekci `tools` a `getPublishedTools()` jako jediný vstup pro nástroje a upravit zmínku o neutrálním tónu. Ověřit, že `npm run check` a `npm run build` projdou a `openspec validate add-tool-pages --strict` je bez chyb.
