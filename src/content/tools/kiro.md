---
title: Kiro
description: Vývojové prostředí od Amazon Web Services s vestavěnými specifikacemi. Každá funkce projde požadavky, návrhem a úkoly.
kind: IDE
license: komerční
website: https://kiro.dev/
docs: https://kiro.dev/docs/specs/
verifiedDate: 2026-10-27
pubDate: 2026-10-27
---

Kiro je komerční produkt Amazon Web Services. Je to vývojové prostředí s AI agentem, dostupné také jako CLI a na webu (mobilní verze je v preview). Práce se specifikacemi je přímo jeho součástí, nic dalšího se neinstaluje.

## Co to je

V Kiru jsou **specs** strukturované artefakty, které z nápadu na funkci nebo na opravu chyby udělají plán implementace. Každá specifikace má tři soubory v Markdownu, které vznikají postupně a dají se před pokračováním zkontrolovat a upravit.

Vedle specifikací má Kiro **steering**: trvalé instrukce o projektu, které agent dostává při každé práci. A **hooks**, které při určitých událostech automaticky spustí příkaz v shellu nebo prompt pro agenta.

## Jak funguje

| Obecný krok | V Kiru |
|---|---|
| Záměr | popis funkce nebo chyby v chatu; trvalý kontext projektu ve steering souborech |
| Specifikace | `requirements.md` s uživatelskými příběhy a akceptačními kritérii v notaci EARS (u oprav `bugfix.md`) |
| Plán | `design.md` (architektura, sekvenční diagramy, datové toky, ošetření chyb, testování) a `tasks.md` (úkoly) |
| Implementace | spouštění úkolů z `tasks.md` po jednom nebo všech najednou |
| Ověření | Markdown Review s komentáři k pasážím; v IDE Analyze Requirements (mezery a rozpory v požadavcích) a Correctness (property-based testy) |

Funkční specifikace má dvě varianty: **Requirements-First** začíná požadavky, **Design-First** technickým návrhem. **Quick Spec** vytvoří všechny tři soubory najednou, bez schvalování mezi fázemi.

Při spuštění všech úkolů sestaví Kiro graf závislostí a nezávislé úkoly seskupí do „vln“. Úkoly v jedné vlně běží souběžně, vlny po sobě.

## Soubory v repozitáři

Každá specifikace má tři soubory:

```text
requirements.md   (u oprav chyb bugfix.md)
design.md
tasks.md
```

Požadavky se zapisují v notaci EARS (*Easy Approach to Requirements Syntax*) ve tvaru `WHEN [podmínka] THE SYSTEM SHALL [chování]`. Příklad z dokumentace:

```text
WHEN a user submits a form with invalid data
THE SYSTEM SHALL display validation errors next to the relevant fields
```

Steering soubory jsou ve složce `.kiro/steering/` v projektu (výchozí `product.md`, `tech.md` a `structure.md`), globální pak v `~/.kiro/steering/`.

## Instalace

Kiro se stahuje z [kiro.dev](https://kiro.dev/) pro macOS, Windows a Linux. Používání se platí kredity, jednotkou práce agenta. V době ověření:

| Plán | Cena měsíčně | Kredity |
|---|---|---|
| Free | 0 USD | 50 |
| Pro | 20 USD | 1 000 |
| Pro+ | 40 USD | 2 000 |
| Pro Max | 100 USD | 5 000 |
| Power | 200 USD | 10 000 |

Placené plány si mohou dokoupit další kredity a pro firmy jsou plány na zakázku.

## Podporovaná prostředí

Kiro je samostatné prostředí, specifikace v něm fungují bez dalších nástrojů. Výchozí volba modelu je Auto (kombinace několika modelů), ručně jdou vybrat mimo jiné modely Claude od Anthropicu, GPT od OpenAI a modely s otevřenými vahami. Dostupnost modelů se liší podle země.

## Kdy se hodí

Kiro je určený pro ty, kdo chtějí mít specifikace, agenta a editor v jednom produktu. Specifikace v něm pokrývají nové funkce i opravy chyb, kde se zaměřují na příčinu, návrh opravy a kontrolu regresí.
