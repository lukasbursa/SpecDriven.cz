---
title: BMAD-METHOD
description: Agilní metodika s AI agenty a skilly pro role jako produktový vlastník nebo architekt. Rozsah plánování přizpůsobuje velikosti změny.
kind: Metodika
license: MIT
repository: https://github.com/bmad-code-org/BMAD-METHOD
docs: https://docs.bmad-method.org/
stars: 54590
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

BMad Method (BMAD-METHOD) je open-source metodika od BMad Code, LLC. Sama sebe popisuje jako agilní přístup k vývoji s AI, ve kterém se myšlení nepřenechává modelu: rozhodnutí zůstávají výslovně zapsaná a kontext se přenáší do další práce.

## Co to je

BMad pokrývá celou práci, nejen psaní kódu: co se má postavit, jak to drží pohromadě a jak se to mění, když se dozvíte něco nového. Používá **skilly** pro jednotlivé činnosti a role, například analýzu nápadu, produktové požadavky, UX, architekturu nebo implementaci. Některé role mají vlastní agenty, třeba produktová vlastnice Sofia (`bmad-agent-po`).

Proces se přizpůsobuje velikosti práce. Malá změna jde rovnou k implementaci, rozsáhlejší práce dostane tolik plánování, kolik potřebuje. Dokumentace rozlišuje čtyři cesty:

- **Triviální:** zřejmá úprava s nízkým rizikem, BMad není potřeba.
- **Jedna session:** jeden ucelený kus práce jde rovnou do `bmad-build`.
- **Epic:** výsledek na několik sessions. Sofia sepíše požadavky, rozdělí je na stories v pořadí stavby a každá story projde `bmad-build`.
- **Projekt:** několik epiků. Sdílené produktové dokumenty se rozdělí na epiky a každý pak jde cestou epiku.

## Jak funguje

| Obecný krok | V BMad Method |
|---|---|
| Záměr | analýza: `bmad-brainstorming`, `bmad-forge-idea`, `bmad-deep-recon`, `bmad-product-brief`, `bmad-prfaq` |
| Specifikace | `bmad-prd` (produktové požadavky), `bmad-ux`; požadavky epiku nebo story zapisuje `bmad-agent-po` |
| Plán | `bmad-architecture` a rozdělení epiku na stories v souboru `tickets.toml` |
| Implementace | `bmad-build` pro jednu session, `bmad-build-auto` pro session bez dozoru |
| Ověření | ověření je součástí `bmad-build` („build and verify“), celkový výsledek epiku posoudí `bmad-retrospective` |

Skill `bmad` (ve verzi v6.12 `bmad-help`) kdykoli doporučí, co spustit dál a co je volitelné. Cyklus se uzavírá krokem „learn and adjust“, který vrací práci zpět do plánování.

## Soubory v repozitáři

Výstupy se ukládají do složky `_bmad-output` (výchozí název). Každý dokument má vlastní složku `<typ>-<slug>/` uvnitř aktivní iniciativy, například:

```text
_bmad-output/
└── <iniciativa>/
    ├── brief-<slug>/brief-<slug>.md          produktový brief
    ├── prd-<slug>/prd-<slug>.md              produktové požadavky
    ├── ux-<slug>/DESIGN.md, EXPERIENCE.md    UX
    ├── architecture-<slug>/architecture-<slug>.md
    └── <epic>/tickets.toml                   stories v pořadí stavby
```

Vedle PRD, UX a požadavků vzniká ještě soubor `.memlog.md`. Popis výše odpovídá dokumentaci verze v7.

## Instalace

BMad vychází ve dvou řadách a obě potřebují nástroj [uv](https://docs.astral.sh/uv/). V době ověření byla stabilní verze **v6.12** (Node.js 20.12+ a Python 3.10+):

```bash
npx bmad-method install
```

Verze **v7** byla ve fázi preview alpha s častými nekompatibilními změnami. Instaluje se jako sada skillů:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill '*'
```

Nebo jako plugin z marketplace `bmad-code-org/bmad-plugins` v Claude Code či Codexu. Po instalaci se v AI asistentovi spustí `bmad setup` a pak `bmad-build` s popisem změny.

## Podporovaná prostředí

Verze v7 vyžaduje AI asistenta, který podporuje skilly. Oficiální pluginy existují pro Claude Code a Codex. Instalátor skillů se při instalaci zeptá, do kterých nástrojů skilly nainstalovat.

## Kdy se hodí

Podle autorů pokrývá stejná metoda víkendový prototyp i systém s mnohaletou historií. Pro existující kód má dokumentace samostatný postup, jak nejdřív ověřit kontext a teprve pak plánovat. K metodě existují oficiální moduly, například pro testování (Test Architect), tvorbu vlastních skillů (Builder) nebo vývoj her (Game Dev Studio).
