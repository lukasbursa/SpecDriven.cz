import { getCollection, type CollectionEntry } from 'astro:content';

export type Tool = CollectionEntry<'tools'>;

/**
 * Publikované nástroje podle popularity: hvězdy na GitHubu sestupně, nástroje
 * bez hvězd na konci, při shodě abecedně. Jediné místo, kde se filtrují koncepty
 * a určuje pořadí – používá ho úvodní stránka, přehled, RSS i generování stránek.
 */
export async function getPublishedTools(): Promise<Tool[]> {
  const tools = await getCollection('tools', ({ data }) => !data.draft);
  return tools.sort(
    (a, b) =>
      (b.data.stars ?? -1) - (a.data.stars ?? -1) || a.data.title.localeCompare(b.data.title, 'cs'),
  );
}

/**
 * Slugy všech nástrojů včetně konceptů. Jen pro kontroly (např. neznámý nástroj
 * ve srovnání), publikované nástroje se vybírají přes getPublishedTools().
 */
export async function getToolIds(): Promise<Set<string>> {
  const tools = await getCollection('tools');
  return new Set(tools.map((tool) => tool.id));
}

/**
 * Datum poslední změny stránky nástroje: nejnovější z publikace, aktualizace
 * a ověření. Nové ověření mění údaje na stránce, proto se počítá jako změna.
 */
export function toolModifiedDate(tool: Tool): Date {
  const { pubDate, updatedDate, verifiedDate } = tool.data;
  const dates = [pubDate, verifiedDate, ...(updatedDate ? [updatedDate] : [])];
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function toolPath(tool: Tool): string {
  return `/nastroje/${tool.id}/`;
}

const numberFormat = new Intl.NumberFormat('cs-CZ');

/** „143 024“ s nezlomitelnou mezerou mezi řády. */
export function formatStars(stars: number): string {
  return numberFormat.format(stars);
}
