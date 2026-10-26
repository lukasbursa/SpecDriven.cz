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

export function toolPath(tool: Tool): string {
  return `/nastroje/${tool.id}/`;
}

const numberFormat = new Intl.NumberFormat('cs-CZ');

/** „143 024“ s nezlomitelnou mezerou mezi řády. */
export function formatStars(stars: number): string {
  return numberFormat.format(stars);
}
