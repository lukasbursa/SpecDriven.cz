// Jediné místo pro nastavení webu. Komponenty si hodnoty berou odtud.

export const site = {
  name: 'SpecDriven.cz',
  tagline: 'Spec-driven development česky',
  description:
    'Český rozcestník o spec-driven developmentu: co to je, jak funguje a jaké nástroje existují.',
  url: 'https://specdriven.cz',
  author: 'Lukáš Burša',
  // Kontakt na správce osobních údajů, vypisuje ho stránka o ochraně údajů.
  contactEmail: 'info@lukasbursa.cz',
  // Profily autora pro strukturovaná data (schema.org sameAs).
  authorProfiles: ['https://github.com/lukasbursa'],
  repo: {
    url: 'https://github.com/lukasbursa/SpecDriven.cz',
    branch: 'main',
  },
  openspecUrl: 'https://github.com/Fission-AI/OpenSpec',
  introArticlePath: '/clanky/co-je-spec-driven-development/',
  ogImage: '/og-default.png',
  privacyPath: '/ochrana-osobnich-udaju/',
  // Google Analytics 4. Načte se až po souhlasu a jen na doméně z `url`.
  analytics: {
    measurementId: 'G-Z05Q363X59',
  },
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

/** Odkaz na soubor v repozitáři, volitelně se zvýrazněnými řádky `[od, do]`. */
export function repoBlobUrl(path: string, lines?: [number, number]): string {
  const hash = lines ? `#L${lines[0]}-L${lines[1]}` : '';
  return `${site.repo.url}/blob/${site.repo.branch}/${path}${hash}`;
}

/** Odkaz na editor souboru na GitHubu, např. `src/content/tools/openspec.md`. */
export function repoEditUrl(filePath: string): string {
  return `${site.repo.url}/edit/${site.repo.branch}/${filePath}`;
}

/** Odkaz na nové issue ze šablony, `fields` předvyplní pole formuláře podle jejich `id`. */
export function newIssueUrl(template: string, fields: Record<string, string> = {}): string {
  return `${site.repo.url}/issues/new?${new URLSearchParams({ template, ...fields })}`;
}
