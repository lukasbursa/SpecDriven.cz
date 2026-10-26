---
title: GSD Core
description: Open-source framework pro spec-driven development a práci s kontextem, který vede AI asistenta smyčkou Discuss, Plan, Execute, Verify a Ship.
kind: Plugin
license: MIT
website: https://opengsd.net/
repository: https://github.com/open-gsd/gsd-core
docs: https://github.com/open-gsd/gsd-core/blob/main/docs/README.md
stars: 10889
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

GSD Core (zkratka hesla *Get Shit Done*, dnes *Git. Ship. Done.*) je open-source framework, který spojuje spec-driven development s řízením kontextu AI asistenta. Vyvíjí se v repozitáři `open-gsd/gsd-core`. Původní repozitář `gsd-build/get-shit-done` je archivovaný.

## Co to je

GSD Core řeší hlavně *context rot*: zhoršování kvality výstupu, když se kontextové okno modelu postupně zaplňuje. Náročnou práci (rešerši, plánování, implementaci, ověření) proto spouští v subagentech s čistým kontextem a hlavní konverzace zůstává štíhlá. Mezi sezeními si stav předává přes soubory ve složce `.planning/`.

Práce je rozdělená na **milníky** (vydatelné verze produktu s vlastními požadavky) a ty na **fáze**, tedy ohraničené kusy práce. Každá fáze projde stejnou smyčkou. Drobné úkoly, pro které by smyčka byla zbytečně těžká, obslouží `/gsd-quick`.

## Jak funguje

Smyčka jedné fáze je *Discuss → (UI design) → Plan → Execute → Verify → Ship*.

| Obecný krok | V GSD Core |
|---|---|
| Záměr | `/gsd-new-project` (nebo `/gsd-onboard` u existujícího kódu) vytvoří `PROJECT.md` a `ROADMAP.md` s cíli fází |
| Specifikace | `REQUIREMENTS.md` s číslovanými akceptačními kritérii (např. `AUTH-01`); `/gsd-discuss-phase` zapíše rozhodnutí fáze do `CONTEXT.md`, volitelně `/gsd-ui-phase` vytvoří `UI-SPEC.md` |
| Plán | `/gsd-plan-phase`: rešerše do `RESEARCH.md`, plány `PLAN.md` seřazené do vln a kontrola plánů |
| Implementace | `/gsd-execute-phase` spouští plány ve vlnách souběžně, každý v čistém kontextu, s commitem po každém úkolu |
| Ověření | ověřovací agent porovná výsledek s cílem fáze, požadavky a rozhodnutími do `VERIFICATION.md` a navrhne opravy; `/gsd-verify-work` pro akceptační testování |

Poslední krok `/gsd-ship` vytvoří pull request a fázi archivuje. Pozici projektu ve smyčce (aktivní milník, fáze, hotové plány) drží `STATE.md`.

## Soubory v repozitáři

```text
.planning/
├── PROJECT.md            identita projektu
├── ROADMAP.md            milníky a fáze s cíli
├── REQUIREMENTS.md       číslovaná akceptační kritéria
├── STATE.md              aktuální pozice ve smyčce
├── config.json           nastavení workflow a modelů
└── phases/
    └── 01-<slug>/
        ├── 01-CONTEXT.md         rozhodnutí z discuss
        ├── 01-RESEARCH.md        rešerše
        ├── 01-01-PLAN.md         plán (jeden soubor na plán)
        ├── 01-01-SUMMARY.md      záznam o provedení
        └── 01-VERIFICATION.md    ověření cíle fáze
```

Ověření nekončí u testů. Kontroluje, jestli fáze pokryla všechna ID požadavků a jestli se promítla rozhodnutí z `CONTEXT.md`.

## Instalace

Potřebujete Node.js 18+ a npm. Instalátor se zeptá na AI asistenta a na to, jestli instalovat globálně, nebo jen do projektu:

```bash
npx @opengsd/gsd-core@latest
```

Instalátor je povinný, protože soubory agentů a příkazů převádí do formátu konkrétního asistenta. Pak se v asistentovi spustí `/gsd-new-project` pro nový projekt nebo `/gsd-onboard` pro existující kód. V Claude Code instalace navíc zaregistruje hooky, například pro sledování zaplnění kontextu a ochranu souborů s tajnými údaji.

## Podporovaná prostředí

README uvádí Claude Code, OpenCode, Antigravity CLI, Kimi CLI, Kilo, Codex, GitHub Copilot, Cursor, Windsurf a další. Nativním formátem příkazů a agentů je Claude Code, pro ostatní je instalátor převádí.

## Kdy se hodí

GSD Core míří na větší funkce, které se dají rozdělit na fáze s jasným, ověřitelným cílem, a na práci přes několik sezení, kde se kontext snadno ztrácí. Dokumentace doporučuje fáze spíš dělit: dobrá fáze má cíl v jedné větě a jde paralelně provést v několika nepřekrývajících se plánech. Pro existující kód má samostatný postup přes `/gsd-onboard`.
