## 1. Přepnutí režimu bez ovládání

- [x] 1.1 Doplnit do `src/styles/tokens.css` pravidla `:root[data-theme='light']` a `:root[data-theme='dark']` podle design.md (rozhodnutí 1) a upravit komentář v hlavičce souboru. Ověřit v prohlížeči ručním přidáním atributu `data-theme="dark"` na `<html>` při světlém systému, že se celá stránka včetně bloků kódu přebarví na tmavou variantu, a `data-theme="light"` při tmavém systému naopak.
- [x] 1.2 Přidat do `src/layouts/BaseLayout.astro` inline skript (`is:inline`) hned za `<style is:inline>` s pořadím vrstev, který v `try/catch` přečte klíč `color-scheme` z `localStorage` a při hodnotě `light` nebo `dark` nastaví `data-theme` na `<html>`. Ověřit, že `<style>` s vrstvami zůstává prvním prvkem stylu v `<head>`, a scénář „Načtení bez bliknutí“: s uloženou hodnotou `dark` a světlým systémem se stránka od prvního vykreslení zobrazí tmavě (záznam výkonu v DevTools, zpomalená síť).

## 2. Tlačítko v hlavičce

- [x] 2.1 Přidat do `src/components/Header.astro` za `<nav>` tlačítko s atributem `hidden`, ikonami měsíce a slunce, `aria-label`, `aria-pressed` a `title` podle design.md (rozhodnutí 5) a styly v `@layer components` (44 × 44 px, barva `--ink`, při najetí `--accent`, ikona podle `aria-pressed`). Ověřit v `dist/`, že tlačítko je v HTML každé stránky včetně `404.html` s atributem `hidden`, a v prohlížeči s vypnutým JavaScriptem, že se nezobrazí (styl tlačítka nesmí přepsat `display` u `[hidden]`).
- [x] 2.2 Napsat obsluhu tlačítka jako `<script>` komponenty podle design.md (rozhodnutí 4 a 5): odkrytí tlačítka jen při podpoře `light-dark()`, stav podle aktivní varianty, klik s pravidlem „shoda se systémem = smazat volbu“, překreslení při změně systému. Ověřit v prohlížeči scénáře „Ruční přepnutí“, „Volba platí na dalších stránkách“, „Návrat k systému“ a „Změna systému při otevřené stránce“ (systémový režim přepínat emulací `prefers-color-scheme` v DevTools) a obsah `localStorage` po každém kroku.
- [x] 2.3 Převést `.header__inner` na grid podle design.md (rozhodnutí 6). Ověřit v prohlížeči scénář „Tlačítko na mobilu“ na 320 px, rozložení na šířce 1280 px (název vlevo, navigace a tlačítko vpravo na jednom řádku) a že se výška hlavičky po odkrytí tlačítka nezmění.
- [x] 2.4 Ověřit scénář „Ovládání klávesnicí a čtečkou“: tlačítko je v pořadí zaměření za posledním odkazem navigace, Enter i mezerník přepnou variantu, indikátor zaměření je vidět v obou variantách a VoiceOver ohlásí „Tmavý režim“ se stavem. Ověřit kontrast ikony vůči pozadí alespoň 3 : 1 v obou variantách.
- [x] 2.5 Ověřit v prohlížeči s blokovaným úložištěm (např. Safari, anonymní okno s blokováním dat webů), že přepnutí funguje na aktuální stránce a v konzoli není chyba.

## 3. Texty a dokumentace

- [x] 3.1 Nahradit větu o JavaScriptu v `src/pages/jak-vznikl-tento-web.astro` a v `README.md` podle design.md (rozhodnutí 7). Ověřit, že v `src/` ani v `README.md` nezůstalo tvrzení, že web nemá žádný JavaScript (`grep -rni javascript src README.md`), a že u odkazů na novém řádku nechybí mezera.
- [x] 3.2 Upravit v `CLAUDE.md` odrážku o JavaScriptu a barevném režimu (inline skript v `<head>`, obsluha v hlavičce, klíč `color-scheme`, atribut `data-theme`, proč nesmí být inline skript modulem). Ověřit, že popis odpovídá implementaci.

## 4. Kontrola

- [x] 4.1 Ověřit, že `npm run check` a `npm run build` projdou, `openspec validate add-color-scheme-toggle --strict` je bez chyb a v `dist/` není žádný `<script>` s adresou jiné domény.
