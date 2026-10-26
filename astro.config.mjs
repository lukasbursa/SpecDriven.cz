import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Astro písma stáhne z Fontsource při buildu a servíruje je z vlastní domény,
// prohlížeč návštěvníka tedy nekontaktuje žádný cizí server.
const fontProvider = fontProviders.fontsource();
const subsets = ['latin', 'latin-ext'];

export default defineConfig({
  site: 'https://specdriven.cz',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  fonts: [
    {
      provider: fontProvider,
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 600],
      styles: ['normal', 'italic'],
      subsets,
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProvider,
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 600],
      styles: ['normal'],
      subsets,
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
