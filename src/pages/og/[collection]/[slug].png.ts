import type { APIContext } from 'astro';
import { getPublishedArticles, type Article } from '../../../lib/articles';
import { ogImagePath, ogSection, renderOgImage } from '../../../lib/og-image';
import { getPublishedTools, type Tool } from '../../../lib/tools';
import { site } from '../../../site.config';

// PNG obrázky pro sdílení z `<slug>.og.svg` vedle článků a nástrojů. Jen publikované
// stránky, které SVG mají. Ostatní použijí výchozí obrázek a build na ně upozorní.
export async function getStaticPaths() {
  const entries: (Article | Tool)[] = [...(await getPublishedArticles()), ...(await getPublishedTools())];

  const missing = entries.filter((entry) => !ogImagePath(entry));
  if (missing.length > 0) {
    const list = missing.map((entry) => `${ogSection(entry)}/${entry.id}`).join(', ');
    console.warn(`Obrázek pro sdílení chybí, použije se ${site.ogImage}: ${list}`);
  }

  return entries
    .filter((entry) => ogImagePath(entry))
    .map((entry) => ({ params: { collection: ogSection(entry), slug: entry.id }, props: { entry } }));
}

export function GET({ props }: APIContext<{ entry: Article | Tool }>) {
  return new Response(renderOgImage(props.entry), { headers: { 'Content-Type': 'image/png' } });
}
