export const genCardsString = (chars: string[]): string => {
  // helper function to produce alphabet emojis
  let generated = '';
  chars.forEach((char) => {
    generated += `:regional_indicator_${char}: `;
  });
  return generated;
};

export const genInitialCards = () => {
  const allChars: string[] = [];
  for (let i = 0; i < 26; i += 1) {
    allChars.push(String.fromCharCode(i + 97));
  }

  const cards: string[] = [];
  while (cards.length < 11) {
    const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    if (!cards.includes(newChar)) {
      cards.push(newChar);
    }
  }

  return {
    p1Cards: cards.slice(0, 5),
    p2Cards: cards.slice(5, 10),
    startingChar: cards.pop()!,
  };
};
