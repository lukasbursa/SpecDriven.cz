import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { Article } from './articles';
import type { Tool } from './tools';

// Obrázky pro sdílení: SVG vedle souboru s obsahem (`<slug>.og.svg`), které build
// převede na PNG. Kreslí je Claude podle pravidel v CLAUDE.md. Cesty se berou
// z process.cwd(), protože modul se při buildu přesune do jiné složky.

type Entry = Article | Tool;

const sections = { articles: 'clanky', tools: 'nastroje' } as const;

/** Část adresy podle kolekce: `clanky` nebo `nastroje`. */
export function ogSection(entry: Entry): (typeof sections)[keyof typeof sections] {
  return sections[entry.collection];
}

// Cesta k SVG relativně ke kořeni repozitáře, např. src/content/articles/x.og.svg.
function svgFile(entry: Entry): string {
  return entry.filePath!.replace(/\.mdx?$/, '.og.svg');
}

/** Adresa PNG obrázku stránky, nebo `undefined`, když stránka nemá SVG. */
export function ogImagePath(entry: Entry): string | undefined {
  return existsSync(join(process.cwd(), svgFile(entry))) ? `/og/${ogSection(entry)}/${entry.id}.png` : undefined;
}

const allowedFonts = ['IBM Plex Sans', 'IBM Plex Mono'];

// Písma jsou součástí repozitáře (TTF, resvg neumí WOFF), systémová se nenačítají,
// aby výsledek nezávisel na stroji, který web sestavuje.
const fontFiles = [
  'IBMPlexSans-Regular.ttf',
  'IBMPlexSans-SemiBold.ttf',
  'IBMPlexMono-Regular.ttf',
  'IBMPlexMono-SemiBold.ttf',
].map((name) => join(process.cwd(), 'src/assets/fonts/og', name));

// Konzervativní kontrola regulárními výrazy. Nejde o bezpečnostní hranici (SVG se
// nezveřejňuje), ale o ochranu před vzhledem, který by se lišil od vykresleného
// náhledu: chybějící písmo, nenačtený obrázek, špatný ořez.
function checkSvg(svg: string, file: string): void {
  const fail = (reason: string): never => {
    throw new Error(`Obrázek pro sdílení ${file}: ${reason}`);
  };

  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? fail('chybí element <svg>.');
  for (const [attribute, value] of [
    ['width', '1200'],
    ['height', '630'],
    ['viewBox', '0 0 1200 630'],
  ]) {
    if (!new RegExp(`\\s${attribute}="${value}"`).test(root)) {
      fail(`kořenový <svg> musí mít ${attribute}="${value}", požadovaný rozměr je 1200×630.`);
    }
  }

  if (/<script\b/i.test(svg)) fail('obsahuje <script>.');
  if (/<foreignObject\b/i.test(svg)) fail('obsahuje <foreignObject> s vloženým HTML.');
  if (/\son[a-z]+\s*=/i.test(svg)) fail('obsahuje obsluhu události (atribut on…).');
  if (/@import|@font-face/i.test(svg)) fail('obsahuje @import nebo @font-face.');

  for (const [, target] of svg.matchAll(/\s(?:xlink:)?href\s*=\s*["']([^"']*)["']/g)) {
    if (!target.startsWith('#')) fail(`odkazuje mimo obrázek: ${target}`);
  }
  for (const [, target] of svg.matchAll(/url\(\s*["']?([^"')\s]*)/g)) {
    if (!target.startsWith('#')) fail(`odkazuje mimo obrázek: url(${target})`);
  }

  // font-family v atributu i ve stylu, hodnota může být seznam písem.
  const families = [
    ...svg.matchAll(/font-family\s*=\s*"([^"]*)"/g),
    ...svg.matchAll(/font-family\s*=\s*'([^']*)'/g),
    ...svg.matchAll(/font-family\s*:\s*([^;}"]+)/g),
  ].flatMap(([, value]) => value.split(',').map((family) => family.trim().replace(/^["']|["']$/g, '')));
  for (const family of families) {
    if (!allowedFonts.includes(family)) {
      fail(`používá písmo „${family}“, povolená jsou jen ${allowedFonts.join(' a ')}.`);
    }
  }
}

/** Zkontroluje SVG stránky a vrátí PNG 1200×630. Chyba uvede soubor a důvod. */
export function renderOgImage(entry: Entry): Uint8Array<ArrayBuffer> {
  const file = svgFile(entry);
  const svg = readFileSync(join(process.cwd(), file), 'utf8');
  checkSvg(svg, file);
  try {
    const resvg = new Resvg(svg, {
      font: { loadSystemFonts: false, fontFiles, defaultFontFamily: 'IBM Plex Sans' },
    });
    return new Uint8Array(resvg.render().asPng());
  } catch (error) {
    throw new Error(`Obrázek pro sdílení ${file}: nejde vykreslit (${(error as Error).message}).`);
  }
}
