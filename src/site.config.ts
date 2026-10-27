// Jediné místo pro nastavení webu. Komponenty si hodnoty berou odtud.

export const site = {
  name: 'SpecDriven.cz',
  tagline: 'Spec-driven development česky',
  description:
    'Český rozcestník o spec-driven developmentu: co to je, jak funguje a jaké nástroje existují.',
  url: 'https://specdriven.cz',
  author: 'Lukáš Burša',
  repo: {
    url: 'https://github.com/lukasbursa/SpecDriven.cz',
    branch: 'main',
  },
  openspecUrl: 'https://github.com/Fission-AI/OpenSpec',
  introArticlePath: '/clanky/co-je-spec-driven-development/',
  ogImage: '/og-default.png',
} as const;

// Diskuze na GitHubu. Slugy kategorií vytvořil GitHub z názvů a nechal v nich
// diakritiku, do odkazu se dostanou procentově zakódované.
const discussionsUrl = `${site.repo.url}/discussions`;

export const discussions = {
  url: discussionsUrl,
  categories: {
    articles: new URL(`${discussionsUrl}/categories/články`).href,
    tools: new URL(`${discussionsUrl}/categories/nástroje`).href,
  },
} as const;

/** Odkaz na složku v repozitáři, např. `openspec/specs`. */
export function repoTreeUrl(path: string): string {
  return `${site.repo.url}/tree/${site.repo.branch}/${path}`;
}

/** Odkaz na editor souboru na GitHubu, např. `src/content/tools/openspec.md`. */
export function repoEditUrl(filePath: string): string {
  return `${site.repo.url}/edit/${site.repo.branch}/${filePath}`;
}

/** Odkaz na nové issue ze šablony, `fields` předvyplní pole formuláře podle jejich `id`. */
export function newIssueUrl(template: string, fields: Record<string, string> = {}): string {
  return `${site.repo.url}/issues/new?${new URLSearchParams({ template, ...fields })}`;
}
