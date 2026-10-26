---
title: Agent OS
description: Open-source systém pro standardy kódu a specifikace, který AI asistentovi dodává konvence projektu a pomáhá připravit spec před implementací.
kind: Plugin
license: MIT
website: https://buildermethods.com/agent-os
repository: https://github.com/buildermethods/agent-os
docs: https://buildermethods.com/agent-os/workflow
stars: 5548
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

Agent OS je bezplatný open-source systém, který vytvořil Brian Casel z Builder Methods. Doplňuje AI asistenty jako Claude Code nebo Cursor, nenahrazuje je. Popis odpovídá verzi 3.

## Co to je

Těžištěm Agent OS jsou **standardy**: zdokumentované vzory a konvence projektu (pojmenování, struktura, postupy). Agent OS je umí vytáhnout z existujícího kódu, uspořádat a podle toho, co se zrovna staví, vložit do kontextu AI asistenta. Druhou částí je příprava specifikace (*shape spec*), která z popisu funkce, ukázek a souvisejícího kódu sestaví plán ještě před implementací.

Všechno jsou soubory v Markdownu ve složce `agent-os/`, takže je může číst libovolný asistent.

## Jak funguje

| Obecný krok | V Agent OS |
|---|---|
| Záměr | `/plan-product` (mise, roadmapa, technologie produktu); u funkce první otázka `/shape-spec`: co stavíme |
| Specifikace | `/shape-spec` v plan módu: rozsah a rozhodnutí v `shape.md`, odkazy na podobný kód, vizuály |
| Plán | `plan.md` s plánem implementace a `standards.md` s relevantními standardy |
| Implementace | po schválení plánu ho provede AI asistent; prvním úkolem je uložení dokumentace specifikace |
| Ověření | samostatný krok ověření dokumentace nepopisuje; standardy vložené přes `/inject-standards` slouží jako měřítko |

`/shape-spec` se spouští v plan módu (v Claude Code nejdřív `/plan`) a projde pět otázek: co stavíme, jestli existují vizuály, jaký podobný kód prostudovat, jak to souvisí s produktem a které standardy platí. Na rychlé úkoly podle dokumentace stačí samotný plan mód.

Se standardy pracují příkazy `/discover-standards` (vytáhne vzory z kódu), `/index-standards` (udržuje rejstřík) a `/inject-standards` (vloží do kontextu ty, které se k práci hodí).

## Soubory v repozitáři

```text
agent-os/
├── standards/          standardy podle oblastí a index.yml pro výběr
├── product/            mission.md, roadmap.md, tech-stack.md
└── specs/
    └── 2026-01-15-1430-user-comment-system/
        ├── plan.md         úplný plán
        ├── shape.md        rozsah, rozhodnutí a kontext
        ├── references.md   odkazy na podobný kód
        ├── standards.md    obsah relevantních standardů
        └── visuals/        návrhy a snímky obrazovky
.claude/commands/agent-os/  příkazy pro Claude Code
```

Složky specifikací mají v názvu datum a čas (`YYYY-MM-DD-HHMM-<slug>`).

## Instalace

Agent OS se instaluje skriptem. Základní instalace je v domovské složce (`~/agent-os/`) a obsahuje příkazy, profily se standardy (např. `default` a `rails`) a skripty. Do projektu ji zkopíruje skript `project-install.sh`. Přesný postup uvádí [stránka o instalaci](https://buildermethods.com/agent-os/installation), která je přístupná po zadání e-mailu.

## Podporovaná prostředí

Doporučené prostředí je Claude Code, kde má Agent OS plnou podporu příkazů. Dokumentace dále uvádí Cursor, Windsurf, Codex, Antigravity a obecně každého AI asistenta, který umí číst soubory. Mimo Claude Code se na soubory ve složce `agent-os/` odkazuje přímo.

## Kdy se hodí

Agent OS se zaměřuje na sladění AI asistenta se způsobem, jakým tým už pracuje, v libovolném jazyce a frameworku. Plnou specifikaci přes `/shape-spec` dokumentace doporučuje pro větší práci, která potřebuje trvalou dokumentaci, například funkce s vizuály, s referenční implementací nebo s vazbou na produkt.
