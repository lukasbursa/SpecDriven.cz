import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articlePath, getPublishedArticles } from '../lib/articles';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();

  return rss({
    title: `${site.name} – články`,
    description: site.description,
    site: context.site!,
    trailingSlash: true,
    customData: '<language>cs</language>',
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: articlePath(article),
      categories: article.data.tags,
    })),
  });
}
