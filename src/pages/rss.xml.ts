import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articlePath, getPublishedArticles } from '../lib/articles';
import { getPublishedTools, toolPath } from '../lib/tools';
import { site } from '../site.config';

export async function GET(context: APIContext) {
  const articles = (await getPublishedArticles()).map((article) => ({
    title: article.data.title,
    description: article.data.description,
    pubDate: article.data.pubDate,
    link: articlePath(article),
    categories: article.data.tags,
  }));
  const tools = (await getPublishedTools()).map((tool) => ({
    title: tool.data.title,
    description: tool.data.description,
    pubDate: tool.data.pubDate,
    link: toolPath(tool),
    categories: ['nástroje'],
  }));

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    trailingSlash: true,
    customData: '<language>cs</language>',
    items: [...articles, ...tools].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}
