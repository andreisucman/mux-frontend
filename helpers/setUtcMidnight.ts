type setUtcMidnightProps = {
  date: Date;
  isNextDay?: boolean;
  timeZone: string;
};

export default function setUtcMidnight({ date, isNextDay, timeZone }: setUtcMidnightProps) {
  const options: { [key: string]: string } = {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  let midnightDate = new Date(date.toLocaleString("en-US", options));

  midnightDate.setHours(0, 0, 0, 0);

  if (isNextDay) midnightDate.setDate(midnightDate.getDate() + 1);

  const utcMidnightDate = new Date(midnightDate.toLocaleString("en-US", { timeZone: "UTC" }));

  return utcMidnightDate;
}
