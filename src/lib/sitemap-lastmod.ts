import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

// Data poslední změny pro `lastmod` v sitemapě. Sitemap se generuje až po zápisu
// stránek, a tak data bere z jejich metadat article:*_time. Ta stránka spočítala
// z metadat obsahu (articleModifiedDate, toolModifiedDate), pravidla jsou tedy
// jen na jednom místě. Přehled sekce dostane nejnovější datum svých stránek
// a úvodní stránka nejnovější datum ze všech. Ostatní stránky datum nemají.

const sections = ['clanky', 'nastroje'];

const timeMeta = (property: string) => new RegExp(`<meta property="article:${property}" content="([^"]+)"`);

function readPageDate(file: string): Date {
  const html = readFileSync(file, 'utf8');
  const match = html.match(timeMeta('modified_time')) ?? html.match(timeMeta('published_time'));
  if (!match) {
    throw new Error(`Sitemap: stránka ${file} nemá article:modified_time ani article:published_time.`);
  }
  return new Date(match[1]);
}

const newer = (a: Date | undefined, b: Date) => (a && a > b ? a : b);

function collectDates(outDir: string): Map<string, Date> {
  const dates = new Map<string, Date>();
  let newestOverall: Date | undefined;

  for (const section of sections) {
    let newestInSection: Date | undefined;
    for (const entry of readdirSync(join(outDir, section), { withFileTypes: true })) {
      const file = join(outDir, section, entry.name, 'index.html');
      if (!entry.isDirectory() || !existsSync(file)) continue;
      const date = readPageDate(file);
      dates.set(`/${section}/${entry.name}/`, date);
      newestInSection = newer(newestInSection, date);
    }
    if (newestInSection) {
      dates.set(`/${section}/`, newestInSection);
      newestOverall = newer(newestOverall, newestInSection);
    }
  }

  if (newestOverall) dates.set('/', newestOverall);
  return dates;
}

/**
 * Integrace, která po zápisu stránek načte jejich data, a funkce, která k adrese
 * stránky vrátí datum poslední změny, nebo `undefined`. Integrace musí být
 * v konfiguraci před sitemap. Data se nečtou až v `serialize()` sitemapy, protože
 * ta výjimku jen zaloguje, sitemap nezapíše a build skončí úspěšně. Výjimka
 * z vlastního hooku build shodí.
 */
export function lastmodFromPages(): {
  integration: AstroIntegration;
  lookup: (url: string) => Date | undefined;
} {
  let dates: Map<string, Date> | undefined;
  return {
    integration: {
      name: 'sitemap-lastmod',
      hooks: {
        'astro:build:done': ({ dir }) => {
          dates = collectDates(fileURLToPath(dir));
        },
      },
    },
    lookup: (url) => dates?.get(decodeURI(new URL(url).pathname)),
  };
}
