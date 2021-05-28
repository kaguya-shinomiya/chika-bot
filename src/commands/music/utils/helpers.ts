export const secToMin = (sec: number): string =>
  `${Math.floor(sec / 60)}:${sec % 60 < 10 ? `0${sec % 60}` : sec % 60}`;

export const minToSec = (min: string): number => {
  const [_minutes, _seconds] = min.split(":");
  const minutes = parseInt(_minutes, 10);
  const seconds = parseInt(_seconds, 10);

  return minutes * 60 + seconds;
};
