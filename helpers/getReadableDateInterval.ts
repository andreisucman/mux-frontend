import { formatDate } from "./formatDate";

const getReadableDateInterval = (startsAt: Date | string, lastDate: Date | string) => {
  const areSame = new Date(startsAt || 0).toDateString() === new Date(lastDate || 0).toDateString();
  const sameMonth = new Date(startsAt || 0).getMonth() === new Date(lastDate || 0).getMonth();

  const dateFrom = formatDate({
    date: startsAt,
    hideYear: true,
    hideMonth: sameMonth && !areSame,
  });

  const dateTo = formatDate({ date: lastDate, hideYear: true });
  const parts = [dateFrom];

  if (!areSame) {
    parts.push(dateTo);
  }

  return parts.join(" - ");
};

export default getReadableDateInterval;
