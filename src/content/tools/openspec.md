---
title: OpenSpec
description: Open-source nástroj pro příkazovou řádku, ve kterém každá změna dostane vlastní složku s návrhem, delta specifikací, designem a úkoly.
kind: CLI
license: MIT
website: https://openspec.dev/
repository: https://github.com/Fission-AI/OpenSpec
docs: https://openspec.dev/docs
stars: 73063
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

OpenSpec je open-source nástroj od Fission AI. Do repozitáře přidá vrstvu specifikací a sadu příkazů pro AI asistenta, takže se člověk s AI shodne na tom, co se postaví, dřív než vznikne kód.

## Co to je

OpenSpec drží v repozitáři dvě věci: **specifikace**, které popisují současné chování systému, a **změny**, které ho mají upravit. Každá změna má vlastní složku s návrhem (proposal), specifikací, technickým designem a úkoly. Specifikace změny neopakuje celé chování, popisuje jen rozdíl (delta): co se přidává, mění nebo odebírá.

Autoři tento přístup shrnují heslem *fluid not rigid*. Artefakty jde upravit kdykoli a nástroj nevynucuje pevné fáze. OpenSpec je navržený pro existující projekty (brownfield) stejně jako pro nové.

Tento web vzniká v OpenSpec. Jak to vypadá v praxi, popisuje stránka [Jak vznikl tento web](/jak-vznikl-tento-web/).

## Jak funguje

| Obecný krok | V OpenSpec |
|---|---|
| Záměr | `/opsx:explore` k promyšlení nápadu, `proposal.md` v nové změně |
| Specifikace | delta specifikace ve `specs/` uvnitř změny (požadavky a scénáře WHEN/THEN) |
| Plán | `design.md` (technický přístup) a `tasks.md` (úkoly), vše vytvoří `/opsx:propose` |
| Implementace | `/opsx:apply` prochází úkoly a odškrtává je |
| Ověření | `/opsx:verify` (rozšířený profil) a `/opsx:archive`, který delty sloučí do hlavních specifikací |

Typická změna projde třemi příkazy: `/opsx:propose <co-postavit>` založí změnu se všemi artefakty, `/opsx:apply` ji implementuje a `/opsx:archive` ji přesune do archivu a aktualizuje hlavní specifikace. Výchozí profil obsahuje příkazy explore, propose, apply a archive. Rozšířený profil přidává mimo jiné `/opsx:new`, `/opsx:continue`, `/opsx:ff` a `/opsx:verify`.

Zápis příkazů se liší podle nástroje, například `/opsx-propose` v Cursoru a GitHub Copilotu nebo `$openspec-propose` v Codexu.

## Soubory v repozitáři

```text
openspec/
├── config.yaml                   kontext projektu pro generování artefaktů
├── specs/<capability>/spec.md    hlavní specifikace: současné chování
└── changes/
    ├── add-dark-mode/
    │   ├── proposal.md           proč a co se mění
    │   ├── specs/                delta specifikace
    │   ├── design.md             technický přístup
    │   └── tasks.md              úkoly k implementaci
    └── archive/
        └── 2025-01-23-add-dark-mode/
```

Specifikace jsou obyčejný Markdown. Ukázka delty z dokumentace:

```markdown
## ADDED Requirements

### Requirement: Theme selection
The app SHALL let users switch between light and dark themes,
defaulting to the system preference.

#### Scenario: User toggles dark mode
- **WHEN** the user clicks the theme toggle
- **THEN** the app switches to dark mode and persists the choice
```

## Instalace

OpenSpec je jeden spustitelný soubor a nepotřebuje Node.js:

```bash
curl -fsSL https://raw.githubusercontent.com/Fission-AI/OpenSpec/main/scripts/binary/install.sh | sh
cd muj-projekt
openspec init
```

Alternativně `npm install -g @fission-ai/openspec@latest` (Node.js 20.19.0+) nebo `brew install openspec`. Příkaz `openspec init` nainstaluje příkazy pro zvolené AI asistenty. Po aktualizaci nástroje je obnoví `openspec update`.

OpenSpec sbírá anonymní statistiky použití (jen názvy příkazů a verzi). Vypnout je jde příkazem `openspec config set telemetry.enabled false` nebo proměnnou `OPENSPEC_TELEMETRY=0`.

## Podporovaná prostředí

Dokumentace uvádí 46 nástrojů. Všechny dostanou skilly a 32 z nich i příkazy (slash commands), mimo jiné Claude Code, Cursor, GitHub Copilot, Gemini CLI, Kiro, Cline, OpenCode a Devin Desktop (dříve Windsurf). Jen skilly dostanou například Codex, Amp a Warp.

## Kdy se hodí

OpenSpec se zaměřuje na průběžné změny v existujícím kódu i v nových projektech, od osobních projektů po týmy. Pro týmovou práci napříč několika repozitáři nabízí **stores**: specifikace a změny v samostatném repozitáři sdíleném přes git (zatím ve verzi beta).
