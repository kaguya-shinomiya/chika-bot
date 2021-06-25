import { shuffle } from '../../../lib/shuffle';

export const genCardsString = (chars: string[]): string => {
  // helper function to produce alphabet emojis
  let generated = '';
  chars.forEach((char) => {
    generated += `:regional_indicator_${char}: `;
  });
  return generated;
};

export const genInitialCards = (size: number) => {
  const allChars: string[] = [];
  for (let i = 0; i < 26; i += 1) {
    allChars.push(String.fromCharCode(i + 97));
  }
  const shuffled = shuffle(allChars);
  return {
    p1Cards: shuffled.slice(0, size),
    p2Cards: shuffled.slice(size, 2 * size),
    startingChar: shuffled[2 * size + 1],
  };
};
