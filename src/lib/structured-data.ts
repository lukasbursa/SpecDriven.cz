import { site } from '../site.config';
import { articleModifiedDate, articlePath, type Article } from './articles';
import { isoDate } from './dates';
import { toolModifiedDate, toolPath, type Tool } from './tools';

// Objekty pro strukturovaná data (JSON-LD, slovník schema.org). Stránka předá
// pole objektů do SeoHead, který je vypíše jako jeden @graph.

export type StructuredData = Record<string, unknown>;

const absolute = (path: string) => new URL(path, site.url).href;

// Autor je v grafu jednou, ostatní objekty na něj odkazují přes @id.
const authorRef = { '@id': absolute('/#autor') };

/** Autor webu. Patří do grafu každé stránky, která na něj odkazuje. */
export function authorData(): StructuredData {
  return {
    '@type': 'Person',
    ...authorRef,
    name: site.author,
    sameAs: [...site.authorProfiles],
  };
}

/** Web jako celek, pro úvodní stránku. */
export function websiteData(): StructuredData {
  return {
    '@type': 'WebSite',
    name: site.name,
    url: absolute('/'),
    description: site.description,
    inLanguage: 'cs',
    publisher: authorRef,
  };
}

interface Page {
  path: string;
  title: string;
  description: string;
  image: string;
  published: Date;
  modified: Date;
}

function pageArticle({ path, title, description, image, published, modified }: Page): StructuredData {
  const url = absolute(path);
  return {
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: absolute(image),
    inLanguage: 'cs',
    datePublished: isoDate(published),
    dateModified: isoDate(modified),
    author: authorRef,
    publisher: authorRef,
  };
}

/** Článek. `image` je cesta k obrázku pro sdílení, stejná jako v og:image. */
export function articleData(article: Article, image: string): StructuredData {
  const { title, description, pubDate } = article.data;
  return pageArticle({
    path: articlePath(article),
    title,
    description,
    image,
    published: pubDate,
    modified: articleModifiedDate(article),
  });
}

/**
 * Stránka nástroje: text o nástroji, ne nástroj samotný. Proto Article
 * s předmětem SoftwareApplication (ten by sám vyžadoval cenu nebo hodnocení).
 */
export function toolData(tool: Tool, image: string): StructuredData {
  const { title, description, pubDate, website, repository } = tool.data;
  // Schéma nástroje vyžaduje web nebo repozitář.
  const url = (website ?? repository)!;
  return {
    ...pageArticle({
      path: toolPath(tool),
      title,
      description,
      image,
      published: pubDate,
      modified: toolModifiedDate(tool),
    }),
    about: {
      '@type': 'SoftwareApplication',
      name: title,
      applicationCategory: 'DeveloperApplication',
      url,
      ...(repository && repository !== url ? { sameAs: [repository] } : {}),
    },
  };
}

/** Drobečková navigace od úvodní stránky, `items` jsou další úrovně. */
export function breadcrumbData(items: { name: string; path: string }[]): StructuredData {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: site.name, path: '/' }, ...items].map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absolute(path),
    })),
  };
}
