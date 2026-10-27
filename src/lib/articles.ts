import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

/**
 * Publikované články od nejnovějšího. Jediné místo, kde se filtrují koncepty –
 * používá ho výpis, úvodní stránka, RSS i generování stránek článků.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

// Článek se srovnáním nástrojů, na který odkazuje přehled i stránky nástrojů.
const comparisonSlug = 'srovnani-nastroju';

/** Publikovaný článek se srovnáním nástrojů, u konceptu nebo bez článku `undefined`. */
export async function getComparisonArticle(): Promise<Article | undefined> {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.id === comparisonSlug);
}

export function articlePath(article: Article): string {
  return `/clanky/${article.id}/`;
}
