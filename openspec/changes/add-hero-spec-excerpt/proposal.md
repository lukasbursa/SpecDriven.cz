## Why

Úvodní sekce má jediný sloupec a pravá polovina na počítači zůstává prázdná. Web přitom vzniká podle specifikací ve veřejném repozitáři, takže může vedle úvodní sekce ukázat skutečný požadavek, podle kterého tato sekce vznikla. Čtenář tak hned na první obrazovce vidí, jak vypadá zadání a co z něj vzniklo, ještě než si o spec-driven developmentu cokoli přečte.

## What Changes

- Úvodní sekce bude mít na počítači dva sloupce. Vlevo zůstane nadpis, úvodní text a scénář s odkazem na úvodní článek, vpravo přibude úryvek specifikace.
- Úryvek ukáže celý requirement „Vysvětlení SDD na první pohled“ ze souboru `openspec/specs/homepage/spec.md`: v původním znění Markdownu, s cestou k souboru, s čísly řádků a se zvýrazněním nadpisů, klíčových slov SHALL/MUST a WHEN/THEN.
- Text se čte ze souboru při sestavení webu, takže odpovídá specifikaci, ze které byl web sestaven. Když requirement v souboru chybí, sestavení selže.
- Pod úryvkem bude odkaz na stejné řádky souboru na GitHubu.
- Na úzké obrazovce bude úryvek pod scénářem.
- Čtečka obrazovky přečte text požadavku bez znaků Markdownu a bez čísel řádků.

Mimo rozsah: výběr nebo střídání více požadavků, vykreslení Markdownu do podoby článku a změna textu úvodní sekce.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `homepage`: nový požadavek na úryvek specifikace v úvodní sekci.

## Impact

- Nová komponenta `src/components/SpecExcerpt.astro` a nový modul `src/lib/spec-excerpt.ts`, který při sestavení čte soubor z `openspec/specs/` (stejně jako `src/lib/openspec-status.ts`).
- Úprava `src/pages/index.astro` (rozvržení úvodní sekce) a `src/site.config.ts` (odkaz na řádky souboru v repozitáři).
- Přejmenování nebo odstranění požadavku „Vysvětlení SDD na první pohled“ nově shodí sestavení. Musí to uvádět `CLAUDE.md`.
- Žádné nové závislosti a v prohlížeči dál neběží JavaScript.
