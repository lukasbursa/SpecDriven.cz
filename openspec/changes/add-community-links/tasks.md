## 1. Nastavení GitHubu (ručně, autor webu)

- [x] 1.1 V nastavení repozitáře zapnout Discussions a založit kategorie Obecné, Články, Nástroje a Nápady. Ověřit, že stránky kategorií Články a Nástroje obsahují popis kategorie (GitHub vrací stav 200 i pro neexistující slug, stav odpovědi proto nic nedokazuje), a předat URL obou kategorií k zapsání do konfigurace. Slugy jsou `články` a `nástroje`.

## 2. Konfigurace a schéma

- [ ] 2.1 Doplnit do `src/site.config.ts` `discussions` (URL odvozená z `site.repo.url`, URL kategorií z úkolu 1.1), `repoEditUrl()` a `newIssueUrl()` podle design.md. Ověřit, že `npm run check` projde a že `newIssueUrl('zastaraly-udaj.yml', { nastroj: 'OpenSpec', stranka: 'https://specdriven.cz/nastroje/openspec/' })` vrací adresu s parametry `template`, `nastroj` a zakódovanou `stranka`.
- [ ] 2.2 Přidat volitelné pole `discussion` s kontrolou prefixu do kolekcí `articles` a `tools` v `src/content.config.ts`. Ověřit, že build selže s hláškou uvádějící soubor a pole pro odkaz na jiný repozitář (`https://github.com/jiny/repo/discussions/1`) u článku i u nástroje a že s platným odkazem i bez pole projde. Dočasné úpravy obsahu vrátit.

## 3. Šablony issue a pravidla pro přispěvatele

- [ ] 3.1 Vytvořit `.github/ISSUE_TEMPLATE/zastaraly-udaj.yml` s poli `nastroj`, `stranka`, `udaj` a `zdroj` (všechna povinná) a `.github/ISSUE_TEMPLATE/navrh-obsahu.yml` s poli `typ`, `popis` a `zdroje`. Ověřit, že oba soubory jsou platný YAML s klíči `name`, `description` a `body` a že `id` polí odpovídají design.md.
- [ ] 3.2 Vytvořit `.github/ISSUE_TEMPLATE/config.yml` (prázdná issue povolená, odkaz „Dotazy a diskuze“ na Discussions). Ověřit, že URL odkazu je stejná jako `site.discussions.url`.
- [ ] 3.3 Napsat `CONTRIBUTING.md`: tři cesty příspěvku podle hranice z design.md, jak opravit text v `.mdx` souboru beze změny komponent, jak navrhnout změnu přes OpenSpec, věcný tón a oficiální zdroje u faktů. Ověřit, že každý odkaz v souboru vede na existující soubor nebo složku repozitáře.

## 4. Web

- [ ] 4.1 Přidat do `src/components/Footer.astro` odkaz „Diskuze“ s `rel="noopener"`. Ověřit v `dist/` na úvodní stránce, článku, nástroji i `404.html`, že odkaz vede na `site.discussions.url`.
- [ ] 4.2 Vytvořit `src/components/Feedback.astro` podle design.md a vložit ji za obsah v `src/pages/clanky/[slug].astro`. Ověřit v `dist/clanky/co-je-spec-driven-development/index.html`, že sekce „Zpětná vazba“ je za obsahem, odkaz na diskuzi vede na kategorii Články, „Navrhnout úpravu“ vede na `…/edit/main/src/content/articles/co-je-spec-driven-development.mdx` a všechny odkazy mají `rel="noopener"`. Dočasně doplnit článku pole `discussion` a ověřit, že odkaz vede na zadané vlákno.
- [ ] 4.3 Vložit `Feedback.astro` s odkazem „Nahlásit zastaralý údaj“ za sekci „Oficiální odkazy“ v `src/pages/nastroje/[slug].astro`. Ověřit v `dist/nastroje/openspec/index.html` scénáře „Nahlášení zastaralého údaje“, „Nástroj bez vlastního vlákna“ a „Návrh úpravy nástroje“ (cesta `src/content/tools/openspec.md`).
- [ ] 4.4 Přidat sekci „Jak přispět“ do `src/pages/jak-vznikl-tento-web.astro` (tři cesty, odkaz na Discussions a na `CONTRIBUTING.md`, zmínka o účtu na GitHubu). Ověřit v prohlížeči, že text odpovídá scénářům požadavku „Jak přispět“ a že u odkazů na novém řádku nechybí mezera.
- [ ] 4.5 Ověřit v prohlížeči na šířce 320 px a v obou barevných režimech článek i stránku nástroje (sekce „Zpětná vazba“ bez vodorovného posouvání, prefix `##` u nadpisu, čitelný kontrast). Ověřit, že v `dist/` není žádný `<script>`, `<iframe>` ani `<link rel="stylesheet">` s adresou jiné domény.

## 5. Dokumentace a kontrola

- [ ] 5.1 Doplnit do sekce Workflow v `CLAUDE.md` výjimku pro opravy obsahu podle design.md a do sekce Architektura pole `discussion` a adresy GitHubu v `site.config.ts`. Ověřit, že `npm run check` a `npm run build` projdou a `openspec validate add-community-links --strict` je bez chyb.

## 6. Po nasazení (ručně, po pushi do main)

- [ ] 6.1 Na produkci projít odkazy z patičky, článku a nástroje OpenSpec. Ověřit, že „Nahlásit zastaralý údaj“ otevře formulář s předvyplněným nástrojem a adresou stránky, že formulář bez zdroje nejde odeslat a že „Navrhnout úpravu“ nabídne nepřihlášenému návštěvníkovi přihlášení a přihlášenému bez práv vytvoření forku.
