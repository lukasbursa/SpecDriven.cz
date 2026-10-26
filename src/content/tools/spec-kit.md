---
title: Spec Kit
description: Open-source sada nástrojů od GitHubu, která vede AI asistenta od zásad projektu přes specifikaci, plán a úkoly až k implementaci.
kind: CLI
license: MIT
website: https://github.github.com/spec-kit/
repository: https://github.com/github/spec-kit
docs: https://github.github.io/spec-kit/quickstart.html
stars: 143026
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

Spec Kit je open-source projekt GitHubu. Skládá se z nástroje pro příkazovou řádku `specify`, který projekt připraví, a ze sady příkazů (skillů) pro AI asistenta, které práci vedou krok za krokem.

## Co to je

Spec Kit dává AI asistentovi předem připravené postupy, šablony dokumentů a záznam výsledků. Hlavním postupem je spec-driven development: z popisu toho, co se má postavit a proč, vznikne specifikace, z ní plán, úkoly a nakonec kód. Vedle toho nabízí jako rozšíření postup pro opravu chyb a pro posouzení nápadu.

Zvláštností Spec Kitu je **constitution**, tedy zásady projektu (například důraz na kvalitu kódu nebo testování). Vytváří se jednou na projekt a další kroky se proti ní kontrolují.

Postupy jdou upravovat. Spec Kit k tomu má rozšíření (extensions), předvolby (presets), workflow a balíčky (bundles) a katalogy komponent od komunity i vlastní firemní.

## Jak funguje

Příkazy se spouštějí v chatu AI asistenta, ne v terminálu. Jejich zápis se liší podle asistenta, například `/speckit-specify` v GitHub Copilotu nebo `/speckit.specify` v referenční dokumentaci.

| Obecný krok | Ve Spec Kitu |
|---|---|
| Záměr | `/speckit-constitution` (jednou na projekt) a popis funkce předaný příkazu `/speckit-specify` |
| Specifikace | `/speckit-specify` vytvoří specifikaci, volitelně `/speckit-clarify` doplní nejasná místa |
| Plán | `/speckit-plan` (technické řešení a návrh), `/speckit-tasks` (úkoly seřazené podle závislostí) |
| Implementace | `/speckit-implement` provádí úkoly v pořadí podle závislostí |
| Ověření | `/speckit-converge` porovná kód se specifikací, plánem a úkoly; volitelně `/speckit-checklist` a `/speckit-analyze` |

Kroky se spouštějí jeden po druhém a každý výsledek se před pokračováním zkontroluje. Když `/speckit-converge` najde rozdíly, připíše do `tasks.md` nové úkoly. Implementace a kontrola se opakují, dokud příkaz neohlásí `Converged`.

Nejkratší cesta je *specify → plan → tasks → implement → converge*. Úplná cesta přidává constitution, clarify, checklist a analyze.

## Soubory v repozitáři

Spec Kit pracuje ve složce `.specify/` a každá funkce má vlastní složku ve `specs/`. Příklad z dokumentace metodiky:

```text
.specify/
├── memory/constitution.md     zásady projektu
└── feature.json               aktivní funkce
specs/003-chat-system/
├── spec.md                    specifikace
├── plan.md                    technický plán
├── research.md
├── data-model.md
├── contracts/
├── quickstart.md
├── checklists/requirements.md
└── tasks.md                   úkoly
```

Specifikace popisuje uživatelské scénáře seřazené podle priority a ke každému akceptační scénáře ve tvaru *Given / When / Then*. Git není povinný: aktivní funkce se určuje podle `.specify/feature.json`, ne podle větve. Volitelné rozšíření pro git zakládá číslované větve (např. `001-feature-name`).

## Instalace

Potřebujete Python 3.11+, nástroj [uv](https://github.github.io/spec-kit/install/uv.html) a podporovaného AI asistenta na Linuxu, macOS nebo Windows.

```bash
uv tool install specify-cli
specify init muj-projekt --integration copilot
```

Hodnota `--integration` určuje AI asistenta. Do existujícího projektu se další asistent přidá příkazem `specify integration install <klíč>`.

## Podporovaná prostředí

Dokumentace uvádí přes 40 integrací, mimo jiné Claude Code, GitHub Copilot, Cursor, Gemini CLI, Codex CLI, Kiro CLI, opencode a Zed. Pro ostatní asistenty je k dispozici obecná integrace `generic`.

## Kdy se hodí

Spec Kit je určený pro stavbu nových funkcí i celých aplikací. Pro existující kód má dokumentace samostatného průvodce. Díky constitution a předvolbám ho lze přizpůsobit standardům týmu nebo firmy, například požadavku na dohledatelnost v regulovaném prostředí.
