# SpecDriven.cz

Český rozcestník o **spec-driven developmentu (SDD)**: co to je, jak funguje a jaké nástroje existují.

Web je zároveň ukázkou metody. Vzniká veřejně pomocí [OpenSpec](https://github.com/Fission-AI/OpenSpec): každá změna nejdřív dostane návrh a specifikaci, teprve potom kód.

## Kde najdete specifikace

| Složka | Co obsahuje |
|---|---|
| [`openspec/specs/`](openspec/specs/) | Aktuální specifikace webu (co web dělá) |
| [`openspec/changes/`](openspec/changes/) | Rozpracované změny: návrh, delta specifikací, design, úkoly |
| [`openspec/changes/archive/`](openspec/changes/archive/) | Historie dokončených změn |
| [`openspec/config.yaml`](openspec/config.yaml) | Kontext projektu pro AI asistenty |

Postup každé změny: **propose → apply → archive**.

## Lokální vývoj

Potřebujete Node.js 22+.

```sh
npm install
npm run dev      # vývojový server na http://localhost:4321
npm run build    # statický web do složky dist/
npm run preview  # náhled sestaveného webu
npm run check    # kontrola typů
```

## Technologie

[Astro](https://astro.build) (statický výstup), obsah v Markdown/MDX, čisté CSS, písmo IBM Plex. V prohlížeči neběží žádný JavaScript.
