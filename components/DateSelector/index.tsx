import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import modifyQuery from "@/helpers/modifyQuery";
import { daysFrom } from "@/helpers/utils";
import classes from "./DateSelector.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  showCancelButton?: boolean;
  preventDefaultDate?: boolean;
};

function DateSelector({ customStyles, showCancelButton, preventDefaultDate }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

  const changeDates = useCallback(
    (range: [Date | string | null, Date | string | null]) => {
      const defaultDateFrom = daysFrom({ days: -7 });
      const defaultDateTo = daysFrom({ days: 7 });

      let dateFrom = null;
      let dateTo = null;
      const params = [];

      if (range[0]) {
        dateFrom = new Date(range[0]);

        if (range[1]) {
          dateTo = new Date(range[1]);
        }
      } else {
        dateFrom = defaultDateFrom;
        dateTo = defaultDateTo;
      }

      setValue([dateFrom, dateTo]);
      if (preventDefaultDate) return;

      if (dateFrom)
        params.push({ name: "dateFrom", value: dateFrom.toISOString(), action: "replace" });

      if (dateTo) params.push({ name: "dateTo", value: dateTo.toISOString(), action: "replace" });

      const query = modifyQuery({ params });
      router.replace(`${pathname}?${query}`);
    },
    [pathname, router, preventDefaultDate]
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
  }, []);

  useEffect(() => {
    changeDates([dateFromParam, dateToParam]);
  }, []);

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      <DatePickerInput
        type="range"
        placeholder="Pick date range"
        valueFormat="DD MMM"
        value={value}
        flex={1}
        onChange={changeDates}
        className={classes.picker}
      />
      {showCancelButton && (value[0] || value[1]) && (
        <ActionIcon variant="default" onClick={resetDates}>
          <IconX size={18} />
        </ActionIcon>
      )}
    </Group>
  );
}

export default DateSelector;
