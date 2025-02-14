import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./DateSelector.module.css";

function DateSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const changeDates = useCallback(
    (range: [Date | null, Date | null]) => {
      const params = [];

      setValue(range);

      if (range[0] && range[1]) {
        params.push(
          { name: "dateFrom", value: new Date(range[0]).toISOString(), action: "replace" },
          { name: "dateTo", value: new Date(range[1]).toISOString(), action: "replace" }
        );
        const query = modifyQuery({ params });
        router.replace(`${pathname}?${query}`);
      }
    },
    [pathname]
  );

  const resetDates = useCallback(() => {
    setValue([null, null]);
    const query = modifyQuery({
      params: [
        { name: "dateFrom", value: null, action: "delete" },
        { name: "dateTo", value: null, action: "delete" },
      ],
    });

    router.replace(`${pathname}?${query}`);
  }, [pathname]);

  const someDateExists = value.filter(Boolean).length > 0;

  useEffect(() => {
    if (!dateFrom && !dateTo) return;

    const range: [Date | null, Date | null] = [null, null];
    if (dateFrom) range[0] = new Date(dateFrom);
    if (dateTo) range[1] = new Date(dateTo);

    setValue(range);
  }, [dateFrom, dateTo]);

  return (
    <Group className={classes.container}>
      <DatePickerInput
        type="range"
        placeholder="Pick date range"
        valueFormat="DD MMM"
        value={value}
        flex={1}
        onChange={changeDates}
        className={classes.picker}
        // leftSection={<IconCalendar className="icon" />}
      />
    </Group>
  );
}

export default DateSelector;
