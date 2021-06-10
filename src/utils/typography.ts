import he from "he";

export const capitalize = (
  s: string,
  options?: { onlyFirst: boolean }
): string => {
  if (options?.onlyFirst) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const words = s.split(" ");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const parseHtml = (s: string) =>
  he.decode(s.replace(/(<([^>]+)>)/gi, ""));

export const truncate = (s: string, max: number, byWord = false) => {
  if (byWord) {
    const words = s.split(" ");
    if (words.length < max) return s;
    return `${words.slice(0, max).join(" ")} ...`;
  }
  if (s.length <= max) return s;
  return `${s.substring(0, max)} ...`;
};

export const wrapText = (s: string) =>
  s.replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, "$1\n");

export const groupNum = new Intl.NumberFormat("en-US", { useGrouping: true });
