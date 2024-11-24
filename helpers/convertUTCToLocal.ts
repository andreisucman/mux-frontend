type ConvertUTCToLocalProps = {
  utcDate: Date;
  timeZone: string;
};

export function convertUTCToLocal({ utcDate, timeZone }: ConvertUTCToLocalProps) {
  return new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(utcDate))
  );
}
