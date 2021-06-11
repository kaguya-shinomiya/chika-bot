const padTimeZero = (chunk: number): string =>
  `${chunk <= 9 ? `0${chunk}` : chunk}`;

export const secToString = (sec: number): string => {
  if (sec < 60) return `00:${padTimeZero(sec)}`;

  if (sec > 60 && sec < 3600)
    return `${padTimeZero(Math.floor(sec / 60))}:${padTimeZero(sec % 60)}`;

  const subHour = sec % 3600;
  const ss = subHour % 60;
  const mm = (subHour - ss) / 60;
  const hh = Math.floor(sec / 3600);
  return `${padTimeZero(hh)}:${padTimeZero(mm)}:${padTimeZero(ss)}`;
};

export const stringToSec = (min: string): number => {
  const [hh, mm, ss] = min.split(":");
  if (ss) {
    return 3600 * parseInt(hh, 10) + 60 * parseInt(mm, 10) + parseInt(ss, 10);
  }
  if (mm) {
    return 60 * parseInt(hh, 10) + parseInt(mm, 10);
  }
  return parseInt(hh, 10);
};
