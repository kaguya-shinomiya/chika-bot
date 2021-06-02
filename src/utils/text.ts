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

export const truncate = (s: string, maxLen: number) => {
  if (s.length <= maxLen) {
    return s;
  }
  return `${s.substring(0, maxLen)} ...`;
};
