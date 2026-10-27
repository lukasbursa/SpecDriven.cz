## 1. Úprava odkazu

- [x] 1.1 V `src/pages/index.astro` nahradit mezeru před šipkou v textu odkazu nezlomitelnou mezerou (`článkem&nbsp;→`). Text musí zůstat jediným textovým uzlem, žádný `<span>`: `.button` je `inline-flex` a samostatný prvek by se stal vlastní flex položkou, kterou nezlomitelná mezera neudrží. Ověřit v `dist/index.html`, že odkaz obsahuje `článkem&nbsp;→` (nebo znak U+00A0).
- [x] 1.2 V `src/styles/base.css` doplnit `.button` svislé odsazení (`padding: var(--space-2) 1.125rem`). Ověřit, že jednořádková tlačítka na úvodní stránce a na `/ochrana-osobnich-udaju/` mají dál výšku 44 px.

## 2. Ověření

- [x] 2.1 Spustit `npm run check` a `npm run build` a `openspec validate fix-intro-button-wrap --strict`, vše bez chyb.
- [x] 2.2 Na úvodní stránce v prohlížeči na šířce 320 px a 375 px zkontrolovat scénář „Výzva na mobilu“: šipka u slova „článkem“, odstup textu od okrajů, žádné vodorovné posouvání. Na 1280×800 je tlačítko na jednom řádku a scénář viditelný bez posouvání.
