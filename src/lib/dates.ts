// Data na webu jsou bez času (např. 2026-10-26), proto se formátují v UTC,
// aby výsledek nezávisel na časovém pásmu stroje, který web sestavuje.

const longFormat = new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long', timeZone: 'UTC' });
const shortFormat = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** „26. října 2026“ */
export function formatDate(date: Date): string {
  return longFormat.format(date);
}

/** „26. 10. 2026“ */
export function formatDateShort(date: Date): string {
  return shortFormat.format(date);
}

/** Hodnota pro atribut `datetime`, např. „2026-10-26“. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
