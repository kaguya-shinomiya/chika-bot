import axios from "axios";

export const checkWord = (word: string): Promise<boolean> => {
  const uri = `http://api.datamuse.com/words?sp=${word}&max=1`;
  // TODO catch errors properly
  return axios
    .get(uri)
    .then((response) => response.data.length === 1)
    .catch(() => false);
};
