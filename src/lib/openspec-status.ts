// Stav vývoje webu pro stavový řádek v patičce. Čte se přímo ze složky
// openspec/ při sestavení, bez volání CLI `openspec`.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export interface ArchivedChange {
  name: string;
  date: Date;
  /** Cesta ke složce změny relativně ke kořeni repozitáře. */
  path: string;
}

export interface OpenSpecStatus {
  specs: number;
  archived: number;
  latest?: ArchivedChange;
}

const ARCHIVE_PATH = 'openspec/changes/archive';
const ARCHIVE_DIR = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

function subdirectories(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());
}

/** Počet capabilities = složek se souborem spec.md (i vnořených, např. identity/auth). */
function countSpecs(dir: string): number {
  return subdirectories(dir).reduce((count, entry) => {
    const path = join(dir, entry);
    return count + (existsSync(join(path, 'spec.md')) ? 1 : 0) + countSpecs(path);
  }, 0);
}

/**
 * Kdy se která složka objevila v archivu (unixový čas prvního commitu, který ji
 * přidal). Archivace je v gitu přesun, ale log omezený na archiv ho vidí jako
 * přidání. Bez gitu nebo v mělkém klonu vrací undefined, historie tam nestačí.
 */
function archivedAt(root: string): Map<string, number> | undefined {
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  try {
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') {
      console.warn('[openspec-status] Mělký klon gitu: poslední archivovaná změna se určí jen podle názvu složky.');
      return undefined;
    }
    const times = new Map<string, number>();
    let time = 0;
    // Log jde od nejnovějšího commitu, poslední nalezený čas je tedy nejstarší.
    for (const line of git('log', '--diff-filter=A', '--format=%x00%ct', '--name-only', '--', ARCHIVE_PATH).split('\n')) {
      if (line.startsWith('\0')) time = Number(line.slice(1));
      else if (line.startsWith(`${ARCHIVE_PATH}/`)) times.set(line.split('/')[3], time);
    }
    return times;
  } catch {
    console.warn('[openspec-status] Historie gitu není k dispozici: poslední archivovaná změna se určí jen podle názvu složky.');
    return undefined;
  }
}

export function readOpenSpecStatus(root: string): OpenSpecStatus {
  const times = archivedAt(root);
  const archive = subdirectories(join(root, ARCHIVE_PATH))
    .map((entry) => ARCHIVE_DIR.exec(entry))
    .filter((match) => match !== null)
    .map(([dir, date, name]) => ({
      name,
      date: new Date(`${date}T00:00:00Z`),
      path: `${ARCHIVE_PATH}/${dir}`,
      // Necommitnutá archivace je nejnovější. Bez historie rozhoduje jen název.
      archivedAt: times ? (times.get(dir) ?? Infinity) : 0,
    }))
    .sort(
      (a, b) =>
        b.date.getTime() - a.date.getTime() || b.archivedAt - a.archivedAt || b.path.localeCompare(a.path),
    )
    .map(({ archivedAt: _, ...change }) => change);

  return {
    specs: countSpecs(join(root, 'openspec/specs')),
    archived: archive.length,
    latest: archive[0],
  };
}

let cached: OpenSpecStatus | undefined;

/** Stav pro aktuální build. Sestavení běží z kořene repozitáře. */
export function getOpenSpecStatus(): OpenSpecStatus {
  cached ??= readOpenSpecStatus(process.cwd());
  return cached;
}
