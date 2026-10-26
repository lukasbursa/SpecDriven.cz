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

/** Odkaz na složku v repozitáři, např. `openspec/specs`. */
export function repoTreeUrl(path: string): string {
  return `${site.repo.url}/tree/${site.repo.branch}/${path}`;
}
