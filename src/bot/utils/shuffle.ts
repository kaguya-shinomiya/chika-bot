export function shuffle<T>(arr: T[]): T[] {
  let currentIndex = arr.length;

  while (currentIndex) {
    currentIndex -= 1;
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}
