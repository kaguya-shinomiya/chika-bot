export const endOfToday = () => new Date().setHours(23, 59, 59, 999).valueOf();

export const secToWordString = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const subHour = sec % 3600;
  const s = subHour % 60;
  const m = (subHour - s) / 60;
  return `${h ? `${h}h` : ""} ${m ? `${m}min` : ""} ${s ? `${s}s` : ""}`.trim();
};
