import { shuffle } from './shuffle';

describe('#shuffle', () => {
  const testArr = [1, 2, 3, 4, 5];
  it('should not mutate the original array', () => {
    shuffle(testArr);
    expect(testArr).toEqual([1, 2, 3, 4, 5]);
  });
  it('should shuffle lol', () => {
    expect(shuffle(testArr)).not.toEqual(testArr);
  });
});
