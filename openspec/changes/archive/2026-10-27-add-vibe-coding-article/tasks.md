## 1. Zdroje

- [x] 1.1 Dohledat a otevřít primární zdroje z rozhodnutí 3 v design.md: Karpathyho příspěvek na X z 2. 2. 2025, oznámení slova roku 2025 od Collins Dictionary a článek Simona Willisona z března 2025. Ověřit, že každý zdroj existuje a říká to, co mu článek přisuzuje. Citáty zkopírovat doslova i s URL. Když zdroj nejde najít nebo říká něco jiného, zapsat do design.md, co se s tvrzením stane.
- [x] 1.2 Rozhodnout o studii METR z července 2025: přečíst její shrnutí a omezení. Ověřit, že se tvrzení i omezení vejdou do jedné věty, jinak studii nepoužít. Výsledek zapsat do tabulky zdrojů v design.md.

## 2. Článek

- [x] 2.1 Vytvořit `src/content/articles/konec-vibe-codingu.mdx` s metadaty z rozhodnutí 2 (`pubDate` = den ověření zdrojů) a se štítkem `názor`, bez zvláštní věty v textu, že jde o názorový článek. Ověřit, že `npm run build` projde a stránka `/clanky/konec-vibe-codingu/` má nadpis „Konec vibe codingu? Přichází spec-driven development“ a štítek `názor`.
- [x] 2.2 Napsat sekce 1–3 (Co je vibe coding, Kde vibe coding funguje, Kde se láme) podle osnovy v rozhodnutí 1. Citáty v angličtině s překladem hned za nimi. Ověřit, že u vymezení pojmu je odkaz na Karpathyho příspěvek a sekce 2 uvádí aspoň jednu situaci, ve které je vibe coding vhodná volba.
- [x] 2.3 Napsat sekci 4 se srovnávací tabulkou v Markdownu podle rozhodnutí 6 (přístupy ve sloupcích, hlediska v řádcích, první řádek „Kde žije zadání“). Ověřit, že v řádcích „Rychlost startu“ a „Režie u drobností“ vede vibe coding a že se tabulka na šířce 320 px posouvá sama a stránka ne.
- [x] 2.4 Napsat sekci 5 „Jedna změna dvakrát“ podle rozhodnutí 4: prompt jako jedna věta, seznam toho, co v něm chybí, dva scénáře přes `Scenario.astro` („Načtení bez bliknutí“, „Prohlížeč bez JavaScriptu“) zkopírované ze specifikace `site-layout` a odkaz na archivovanou změnu přes `repoTreeUrl()`. Ověřit, že text netvrdí, co by AI vygenerovala, že znění scénářů odpovídá `openspec/specs/site-layout/spec.md` a že odkaz v `dist/` vede na existující složku na GitHubu.
- [x] 2.5 Napsat sekce 6–8 (Co tím získáte, Co to stojí, Kdy co). Rozhodování v sekci 8 jako číslovaný seznam otázek podle rozhodnutí 5, včetně hybridní cesty. Ověřit, že sekce 8 dává aspoň jednu situaci pro vibe coding a aspoň jednu pro specifikaci a že článek neobsahuje žádný ASCII diagram.
- [x] 2.6 Napsat závěr s odkazy na úvodní článek, přehled `/nastroje/` a srovnání nástrojů a s větou, že web i tento článek vznikají v OpenSpec, s odkazem na `openspec/specs/articles/spec.md` přes `repoBlobUrl()` podle rozhodnutí 7. Ověřit v `dist/clanky/konec-vibe-codingu/index.html`, že odkazy vedou na existující stránky webu a na hlavní specifikaci, ne na složku změny.

## 3. Odkazy a pravidla pro názorové články

- [x] 3.1 Doplnit na konec sekce „Proč se o SDD mluví právě teď“ v `src/content/articles/co-je-spec-driven-development.mdx` větu s odkazem na nový článek a nastavit `updatedDate`. Ověřit v `dist/clanky/co-je-spec-driven-development/index.html`, že odkaz v této sekci vede na `/clanky/konec-vibe-codingu/`.
- [x] 3.2 Doplnit pravidlo pro názorové články do kontextu v `openspec/config.yaml` a do sekce „Tón obsahu“ v `CONTRIBUTING.md` podle rozhodnutí 8. V `CLAUDE.md` u popisu `config.yaml` doplnit, že výjimkou z věcného tónu jsou názorové články se štítkem `názor`. Ověřit, že všechna tři místa říkají totéž a `openspec instructions proposal --change add-vibe-coding-article --json` vrací nový odstavec v `context`.

## 4. Kontrola

- [x] 4.1 Projít článek tvrzení po tvrzení podle scénáře „Fakta bez zdroje“. Ověřit, že každé faktické tvrzení má odkaz na zdroj z úkolu 1 a že článek nikde netvrdí, že se vibe coding už nepoužívá.
- [x] 4.2 Ověřit, že `npm run check` a `npm run build` projdou, `openspec validate add-vibe-coding-article --strict` je bez chyb, `/clanky/` ukazuje nový článek jako nejnovější a `/rss.xml` ho obsahuje. Zkontrolovat článek v prohlížeči na 320 px a 1280 px ve světlém i tmavém režimu.
