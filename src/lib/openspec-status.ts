// Stav vývoje webu pro stavový řádek v patičce. Čte se přímo ze složky
// openspec/ při sestavení, bez volání CLI `openspec`.

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

export function readOpenSpecStatus(root: string): OpenSpecStatus {
  const archive = subdirectories(join(root, 'openspec/changes/archive'))
    .map((entry) => ARCHIVE_DIR.exec(entry))
    .filter((match) => match !== null)
    .map(([dir, date, name]) => ({
      name,
      date: new Date(`${date}T00:00:00Z`),
      path: `openspec/changes/archive/${dir}`,
    }))
    .sort((a, b) => b.path.localeCompare(a.path));

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
