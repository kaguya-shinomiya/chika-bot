export function shuffle<T>(arr: T[]): T[] {
  const carr = [...arr];
  let currentIndex = carr.length;

  while (currentIndex) {
    currentIndex -= 1;
    const randomIndex = Math.floor(Math.random() * currentIndex);

    [carr[currentIndex], carr[randomIndex]] = [
      carr[randomIndex],
      carr[currentIndex],
    ];
  }
  return carr;
}
