## Why

O spec-driven developmentu (SDD) skoro nic nevychází česky a nástroje jako OpenSpec, Spec Kit nebo Kiro se vyvíjejí tak rychle, že se v nich začátečník snadno ztratí. Na doméně SpecDriven.cz chceme český rozcestník, který SDD neutrálně vysvětlí: co to je, jak funguje a jaké nástroje existují, bez upřednostňování kteréhokoli z nich. Zároveň ukáže metodu v praxi: celý web vzniká přes OpenSpec ve veřejném repozitáři.

Tato první změna položí základ webu, aby na něj šlo dalšími změnami přidávat obsah.

## What Changes

- Nový statický web s jednotným vzhledem: hlavička s navigací, patička a stránka 404.
- Vizuální styl „web jako specifikace“: struktura stránek připomíná specifikaci (prefixy `##`, scénáře WHEN/THEN, frontmatter článků), text zůstává klidný a čitelný. Písmo IBM Plex, modrý akcent, světlý a tmavý režim.
- Úvodní stránka s krátkým vysvětlením SDD, výzvou ve tvaru scénáře (WHEN nevíte, co je SDD → THEN začněte úvodním článkem) a obecným cyklem SDD nezávislým na nástroji.
- Sekce článků: seznam článků a stránka článku. Články se píší jako Markdown/MDX soubory s popisnými metadaty (název, popis, datum, štítky, koncept ano/ne).
- První článek „Co je spec-driven development“ jako ověření celého obsahového řetězce.
- Patička s informací „Tento web byl vytvořen pomocí SDD – OpenSpec“, odkazem na veřejný repozitář a stavovým řádkem, který ukazuje skutečný stav vývoje webu (počet specifikací a archivovaných změn).
- Stránka „Jak vznikl tento web“, která vysvětlí postup a odkáže na složku `openspec/` v repozitáři.
- Základní SEO: titulky, popisy, Open Graph, kanonické URL, sitemap a RSS feed článků.

Mimo rozsah (samostatné budoucí změny): sekce Nástroje (karty a srovnání OpenSpec, Spec Kit, Kiro), Slovník pojmů, vyhledávání, newsletter a komunita, nasazení.

## Capabilities

### New Capabilities
- `site-layout`: Společný rámec všech stránek (hlavička, navigace, patička, 404, jazyk, přístupnost, responzivita, světlý/tmavý režim, dekorativní prvky specifikace).
- `homepage`: Úvodní stránka webu a její obsah.
- `articles`: Publikace článků, jejich metadata, seznam a detail, koncepty a RSS.
- `open-development`: Transparentnost vývoje: zmínka o SDD/OpenSpec v patičce, odkaz na repozitář, stavový řádek a stránka „Jak vznikl tento web“.
- `seo`: Metadata pro vyhledávače a sociální sítě, kanonické URL a sitemap.

### Modified Capabilities
<!-- Žádné, jde o první změnu projektu. -->

## Impact

- Nový Node.js projekt (Astro, TypeScript) v kořeni repozitáře: `package.json`, `astro.config.mjs`, `src/`, `public/`.
- Nové závislosti: Astro, oficiální integrace pro MDX, sitemap a RSS a balíčky s písmem IBM Plex (hostované u nás, ne z Google Fonts).
- Sestavení webu čte složku `openspec/` (kvůli stavovému řádku), takže stav webu odpovídá stavu specifikací v okamžiku buildu.
- Výstupem buildu je statická složka `dist/`, kterou lze nasadit na libovolný statický hosting.
- URL repozitáře a domény budou nastavené na jednom místě v konfiguraci webu.
