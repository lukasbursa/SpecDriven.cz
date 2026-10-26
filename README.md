# SpecDriven.cz

Český rozcestník o **spec-driven developmentu (SDD)**: co to je, jak funguje a jaké nástroje existují.

Web je zároveň ukázkou metody. Vzniká veřejně pomocí [OpenSpec](https://github.com/Fission-AI/OpenSpec): každá změna nejdřív dostane návrh a specifikaci, teprve potom kód.

## Kde najdete specifikace

| Složka | Co obsahuje |
|---|---|
| [`openspec/specs/`](openspec/specs/) | Aktuální specifikace webu (co web dělá) |
| [`openspec/changes/`](openspec/changes/) | Rozpracované změny: návrh, delta specifikací, design, úkoly |
| [`openspec/changes/archive/`](openspec/changes/archive/) | Historie dokončených změn |
| [`openspec/config.yaml`](openspec/config.yaml) | Kontext projektu pro AI asistenty |

Postup každé změny: **propose → apply → archive**.

## Lokální vývoj

Potřebujete Node.js 22.23.4 nebo novější (CI používá Node 24).

```sh
npm install
npm run dev      # vývojový server na http://localhost:4321
npm run build    # statický web do složky dist/
npm run preview  # náhled sestaveného webu
npm run check    # kontrola typů
```

## Nasazení

Web běží na webhostingu s Apache. Po každém pushi do větve `main` ho [GitHub Actions](.github/workflows/deploy.yml) zkontroluje, sestaví a nahraje přes FTP. Když kontrola nebo build selže, nic se nenahraje. Konfigurace serveru (stránka 404, přesměrování, cache) je v [`public/.htaccess`](public/.htaccess).

Přístupové údaje jsou v secrets repozitáře (Settings → Secrets and variables → Actions):

| Secret | Význam |
|---|---|
| `FTP_HOST` | adresa FTP serveru, případně `host:port` |
| `FTP_USER` | uživatel |
| `FTP_PASSWORD` | heslo |

Web se nahrává do kořenové složky FTP účtu, která je zároveň kořenem webu.

Workflow jde spustit i ručně v záložce Actions. Ve výchozím stavu je to zkušební běh: jen vypíše, co by se nahrálo a smazalo, a na serveru nic nezmění. Nasazení maže ze serveru soubory, které build nevytváří, kromě složky `.well-known/`.

## Technologie

[Astro](https://astro.build) (statický výstup), obsah v Markdown/MDX, čisté CSS, písmo IBM Plex. V prohlížeči neběží žádný JavaScript.
