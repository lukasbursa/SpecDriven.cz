## Why

Stavový řádek v patičce má ukazovat poslední archivovanou změnu, ale při dvou archivacích ve stejný den ukazuje tu, jejíž název je dál v abecedě. Datum ve složce archivu (`YYYY-MM-DD-<název>`) nese jen den, a když se shoduje, rozhoduje název. Po archivaci `add-community-links` proto web dál ukazuje `add-tool-pages` a 26. 10. ukazoval `add-site-foundation` místo později archivované `add-ftp-deploy`. Na webu, který má předvádět svůj vlastní vývoj, je to nepravdivý údaj.

## What Changes

- Poslední archivovaná změna se určí podle okamžiku, kdy se její složka objevila v archivu, ne podle názvu. Okamžik se čte při sestavení z historie gitu (commit, který složku do archivu přidal).
- Archivovaná složka, která ještě není commitnutá (lokální build hned po archivaci), se považuje za nejnovější.
- Když historie gitu není k dispozici nebo je neúplná (build mimo git, mělký klon), build neselže, vypíše varování a řadí jako dosud.
- Nasazení stahuje celou historii repozitáře, aby měl build v CI z čeho pořadí určit.

Zobrazené datum se nemění, dál se bere z názvu složky.

Mimo rozsah: přejmenování archivních složek, zápis času archivace do `.openspec.yaml` nebo jiného souboru, změna pořadí čehokoli jiného než poslední změny ve stavovém řádku.

## Capabilities

### New Capabilities

Žádné.

### Modified Capabilities
- `open-development`: požadavek „Stavový řádek vývoje“ upřesňuje, která změna je poslední, když jich bylo víc archivováno ve stejný den.

## Impact

- `src/lib/openspec-status.ts`: řazení archivovaných změn podle historie gitu, varování a náhradní řazení.
- `.github/workflows/deploy.yml`: `actions/checkout` s `fetch-depth: 0`. Checkout bude o něco pomalejší, repozitář je malý.
- `CLAUDE.md`: poznámka u stavového řádku.
- Build nově volá `git`. V CI i lokálně je k dispozici, bez něj build projde s varováním.
