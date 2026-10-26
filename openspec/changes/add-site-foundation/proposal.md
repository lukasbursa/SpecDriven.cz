## Why

O spec-driven developmentu (SDD) skoro nic nevychází česky a nástroje jako OpenSpec, Spec Kit nebo Kiro se vyvíjejí tak rychle, že se v nich začátečník snadno ztratí. Na doméně SpecDriven.cz chceme český rozcestník, který SDD vysvětlí a nástroje porovná. Zároveň ukáže metodu v praxi: celý web vzniká přes OpenSpec ve veřejném repozitáři.

Tato první změna položí základ webu, aby na něj šlo dalšími změnami přidávat obsah.

## What Changes

- Nový statický web s jednotným vzhledem: hlavička s navigací, patička a stránka 404.
- Úvodní stránka, která jednou větou řekne, co je SDD, a nasměruje čtenáře na články.
- Sekce článků: seznam článků a stránka článku. Články se píší jako Markdown/MDX soubory s popisnými metadaty (název, popis, datum, štítky, koncept ano/ne).
- První článek „Co je spec-driven development“ jako ověření celého obsahového řetězce.
- Patička s informací „Tento web byl vytvořen pomocí SDD – OpenSpec“ a odkazem na veřejný repozitář.
- Stránka „Jak vznikl tento web“, která vysvětlí postup a odkáže na složku `openspec/` v repozitáři.
- Základní SEO: titulky, popisy, Open Graph, kanonické URL, sitemap a RSS feed článků.

## Capabilities

### New Capabilities
- `site-layout`: Společný rámec všech stránek (hlavička, navigace, patička, 404, jazyk, přístupnost, responzivita, světlý/tmavý režim).
- `homepage`: Úvodní stránka webu a její obsah.
- `articles`: Publikace článků, jejich metadata, seznam a detail, koncepty a RSS.
- `open-development`: Transparentnost vývoje: zmínka o SDD/OpenSpec v patičce, odkaz na repozitář a stránka „Jak vznikl tento web“.
- `seo`: Metadata pro vyhledávače a sociální sítě, kanonické URL a sitemap.

### Modified Capabilities
<!-- Žádné, jde o první změnu projektu. -->

## Impact

- Nový Node.js projekt (Astro, TypeScript) v kořeni repozitáře: `package.json`, `astro.config.mjs`, `src/`, `public/`.
- Nové závislosti: Astro a oficiální integrace pro MDX, sitemap a RSS.
- Výstupem buildu je statická složka `dist/`, kterou lze nasadit na libovolný statický hosting.
- URL repozitáře a domény budou nastavené na jednom místě v konfiguraci webu.
