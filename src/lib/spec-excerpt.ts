// Výřez jednoho požadavku ze specifikace OpenSpec pro úryvek na webu. Soubor se
// čte při sestavení, takže úryvek odpovídá specifikaci, ze které web vznikl.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type TokenKind = 'text' | 'marker' | 'heading' | 'keyword' | 'normative';

export interface Token {
  text: string;
  kind: TokenKind;
}

export interface ExcerptLine {
  /** Číslo řádku v souboru, od 1. */
  number: number;
  tokens: Token[];
}

export interface SpecExcerpt {
  /** Cesta k souboru relativně ke kořeni repozitáře. */
  file: string;
  lines: ExcerptLine[];
}

const HEADING = /^(#{1,6} )(.*)$/;
const BULLET = /^(\s*- )(.*)$/;
const KEYWORD = /\*\*(WHEN|THEN|GIVEN|AND)\*\*/g;
const NORMATIVE = /\b(SHALL|MUST)\b/g;

/** Rozdělí text podle vzoru: shody převede `match`, text mezi nimi `rest`. */
function split(
  text: string,
  pattern: RegExp,
  match: (m: RegExpExecArray) => Token[],
  rest: (t: string) => Token[],
): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    tokens.push(...rest(text.slice(last, m.index)), ...match(m));
    last = m.index + m[0].length;
  }
  tokens.push(...rest(text.slice(last)));
  return tokens;
}

function inline(text: string): Token[] {
  const plain = (t: string): Token[] => (t ? [{ text: t, kind: 'text' }] : []);
  const normative = (t: string) => split(t, NORMATIVE, (m) => [{ text: m[0], kind: 'normative' }], plain);
  return split(
    text,
    KEYWORD,
    (m) => [
      { text: '**', kind: 'marker' },
      { text: m[1], kind: 'keyword' },
      { text: '**', kind: 'marker' },
    ],
    normative,
  );
}

function tokenize(line: string): Token[] {
  const heading = HEADING.exec(line);
  if (heading) {
    return [
      { text: heading[1], kind: 'marker' },
      { text: heading[2], kind: 'heading' },
    ];
  }
  const bullet = BULLET.exec(line);
  if (bullet) return [{ text: bullet[1], kind: 'marker' }, ...inline(bullet[2])];
  return inline(line);
}

/**
 * Požadavek `### Requirement: <name>` až po další nadpis úrovně 2 nebo 3.
 * Když ve specifikaci není, vyhodí chybu, takže build selže.
 */
export function readRequirement(file: string, name: string, root = process.cwd()): SpecExcerpt {
  const source = readFileSync(join(root, file), 'utf8').split(/\r?\n/);
  const start = source.findIndex((line) => line.trim() === `### Requirement: ${name}`);
  if (start === -1) {
    throw new Error(`[spec-excerpt] Ve specifikaci ${file} chybí požadavek „${name}“.`);
  }

  let end = source.findIndex((line, i) => i > start && /^#{2,3} /.test(line));
  if (end === -1) end = source.length;
  while (end > start + 1 && source[end - 1].trim() === '') end--;

  return {
    file,
    lines: source.slice(start, end).map((line, i) => ({ number: start + i + 1, tokens: tokenize(line) })),
  };
}
