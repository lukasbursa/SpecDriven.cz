import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Neplatná metadata článku shodí build s chybou, která uvede soubor a pole.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Typ se ukládá rovnou jako český štítek, který se zobrazuje na webu.
export const toolKinds = ['CLI', 'IDE', 'Plugin', 'Metodika', 'Platforma'] as const;

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1).max(160),
      kind: z.enum(toolKinds),
      license: z.string().min(1),
      website: z.url().optional(),
      repository: z.url().optional(),
      docs: z.url().optional(),
      // Počet hvězd na GitHubu, zapsaný ručně k datu ověření.
      stars: z.number().int().nonnegative().optional(),
      verifiedDate: z.coerce.date(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    })
    .refine((tool) => tool.website || tool.repository, {
      message: 'Nástroj potřebuje alespoň jedno z polí website a repository.',
      path: ['website'],
    })
    .refine((tool) => tool.stars === undefined || tool.repository, {
      message: 'Pole stars vyžaduje pole repository.',
      path: ['stars'],
    }),
});

export const collections = { articles, tools };
