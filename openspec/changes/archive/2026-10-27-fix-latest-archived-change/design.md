## Context

`readOpenSpecStatus()` v `src/lib/openspec-status.ts` čte názvy složek v `openspec/changes/archive/` a řadí je sestupně podle celé cesty (`localeCompare`). Datum v názvu nese jen den, takže při shodě rozhoduje název změny. Build běží z kořene repozitáře, lokálně i v CI. Workflow `deploy.yml` dnes dělá `actions/checkout@v5` bez parametrů, tedy mělký klon s jediným commitem.

Archivace je v gitu přesun složky z `openspec/changes/<název>/` do `openspec/changes/archive/<datum>-<název>/`. Pokud se `git log` omezí na archiv, soubory z cesty mimo něj nevidí a přesun ukáže jako přidání (`--diff-filter=A`). Ověřeno na současné historii: pořadí `add-site-foundation`, `add-ftp-deploy`, `add-tool-pages`, `add-community-links` odpovídá skutečnému pořadí archivací.

## Goals / Non-Goals

**Goals:**
- Poslední změna ve stavovém řádku odpovídá poslední archivaci, i když jich bylo víc v jeden den.
- Build nezávisí na tom, jestli je git k dispozici. Bez něj jen ztratí přesnost a řekne to.

**Non-Goals:**
- Řadit podle gitu i mezi dny. Datum v názvu je to, co stavový řádek zobrazuje, a musí s pořadím souhlasit.
- Selhání buildu v mělkém klonu. Pravidlo by zbytečně trestalo přispěvatele, který si stáhl repozitář s `--depth 1`, aby ověřil opravu překlepu.

## Decisions

### 1. Pořadí: datum z názvu, pak okamžik přidání v gitu, pak název

Klíč řazení (sestupně):

```
1. datum ze jména složky              (zobrazované datum, rozhoduje vždy)
2. čas prvního commitu, který složku  (necommitnutá složka = +∞, tedy nejnovější)
   do archivu přidal
3. název složky                       (záloha, když git nic neřekne)
```

Čas se načte jedním voláním při buildu:

```
git log --diff-filter=A --format=%x00%ct --name-only -- openspec/changes/archive
```

Pro každou složku se vezme **nejstarší** čas přidání jejího souboru. Soubor přidaný do archivované změny později (oprava v archivu) tak pořadí nezmění. Volání jde přes `execFileSync` z `node:child_process` s `cwd` nastaveným na kořen, stejně jako čtení složek přes `node:fs`.

*Alternativa:* zapisovat čas archivace do `.openspec.yaml` archivované změny. Šlo by o ruční krok navíc mimo CLI OpenSpec, a když by se zapomněl, chyba by se vrátila potichu. Git čas archivace zná sám.

*Alternativa:* `mtime` složky. Git ho při checkoutu nezachovává, v CI by měly všechny složky stejný čas.

### 2. Když git chybí nebo historie nestačí

| Situace | Jak se pozná | Chování |
|---|---|---|
| git není nainstalovaný nebo kořen není repozitář | `execFileSync` vyhodí výjimku | varování, řazení jen podle bodů 1 a 3 |
| mělký klon | `git rev-parse --is-shallow-repository` vrátí `true` | varování, řazení podle bodů 1 a 3 (v mělkém klonu by se všechny složky jevily jako přidané jedním commitem) |
| složka ještě není commitnutá | v `git log` chybí | čas +∞, je nejnovější |

Varování se vypíše přes `console.warn` jednou za build (hodnota je už cachovaná v `getOpenSpecStatus()`), s textem, že poslední změna ve stavovém řádku může být nepřesná a proč.

### 3. CI stahuje celou historii

V `deploy.yml` dostane `actions/checkout@v5` parametr `fetch-depth: 0`. Repozitář má desítky commitů a malé soubory, zpomalení checkoutu je zanedbatelné.

## Risks / Trade-offs

- [Rebase nebo squash archivních commitů změní jejich čas] → pořadí odpovídá historii po přepsání. V `main` se historie nepřepisuje.
- [Dvě archivace v jednom commitu mají stejný čas] → rozhodne název (bod 3). Postup projektu archivuje každou změnu zvlášť.
- [Volání gitu zpomalí build] → jedno volání nad jednou složkou, řádově milisekundy.

## Migration Plan

Nasazení běžným pushem do `main`. První build s `fetch-depth: 0` ukáže na produkci správnou poslední změnu. Návrat je revert commitu.
