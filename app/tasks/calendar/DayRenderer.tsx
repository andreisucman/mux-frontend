import { useMemo, memo } from "react";
import { Indicator } from "@mantine/core";

type Props = {
  date: Date;
  mode: string;
  status: string;
  dates: string[];
  keysToBeDeleted: string[];
};

function getColor(mode: string, status: string, toBeDeleted?: boolean) {
  let color;

  if (mode === "individual") {
    if (toBeDeleted) {
      if (status === "active") {
        color = "var(--mantine-color-brand-7)";
      } else {
        color = "var(--mantine-color-green-7)";
      }
    } else {
      if (status === "active") {
        color = "var(--mantine-color-green-7)";
      } else {
        color = "var(--mantine-color-gray-4)";
      }
    }
  } else {
    if (toBeDeleted) {
      if (status === "active") {
        color = "var(--mantine-color-brand-7)";
      } else {
        color = "var(--mantine-color-green-7)";
      }
    } else {
      if (status === "active") {
        color = "var(--mantine-color-green-7)";
      } else {
        color = "var(--mantine-color-gray-4)";
      }
    }
  }

  return color;
}

const DayRenderer = ({ date, dates, status, mode, keysToBeDeleted }: Props) => {
  const day = date.getDate();
  const month = date.getMonth();
  const key = `${month}-${day}`;

  const existsInDates = dates.includes(key);
  const toBeDeleted = keysToBeDeleted.includes(key);

  const color = useMemo(() => getColor(mode, status, toBeDeleted), [mode, status, toBeDeleted]);

  return (
    <Indicator size={14} color={color} offset={-5} disabled={!existsInDates}>
      <div>{day}</div>
    </Indicator>
  );
};

export default memo(DayRenderer);
