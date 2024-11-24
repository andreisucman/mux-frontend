type Props = {
  seconds: number;
  showDays?: boolean;
  onlyMinutes?: boolean;
};

export default function convertSecondsToTime({ seconds, showDays, onlyMinutes }: Props) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  seconds %= 60 * 60 * 24;

  const hours = Math.floor(seconds / (60 * 60));
  seconds %= 60 * 60;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  let result = "";

  const formattedDays = days < 10 ? "0" + days : days;
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  result = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  if (showDays) result = `${formattedDays}:${result}`;

  if (onlyMinutes) result = `${formattedMinutes}:${formattedSeconds}`;

  return result;
}
