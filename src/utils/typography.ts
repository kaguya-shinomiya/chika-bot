import he from 'he';

export const parseHtml = (s: string) =>
  he.decode(s.replace(/(<([^>]+)>)/gi, ''));

export const truncate = (s: string, max: number, byWord = false) => {
  if (byWord) {
    const words = s.split(' ');
    if (words.length < max) return s;
    return `${words.slice(0, max).join(' ')} ...`;
  }
  if (s.length <= max) return s;
  return `${s.substring(0, max)} ...`;
};

export const wrapText = (s: string) =>
  s.replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, '$1\n');

export const groupNum = new Intl.NumberFormat('en-US', { useGrouping: true });

export const withAnd = (words: string[]) => {
  if (words.length === 1) return words[0];
  if (words.length === 2) return `${words[0]} and ${words[1]}`;
  return `${words
    .slice(0, words.length - 1)
    .map((word) => `${word},`)
    .join(' ')} and ${words[words.length - 1]}`;
};
