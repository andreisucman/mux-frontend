import React, { useEffect, useMemo, useState } from "react";
import { Accordion, Button, Loader, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import { HandleModifyTaskProps } from "../page";
import MoveRoutineRow, { SimpleRoutineType } from "./MoveRoutineRow";

type Props = {
  buttonText: string;
  handleClick: (args: HandleModifyTaskProps) => Promise<void>;
};

export default function MoveTaskModalContent({ buttonText, handleClick }: Props) {
  const [selectedRoutineId, setSelectedRoutineId] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [routinesOnTheChosenDate, setRoutinesOnTheChosenDate] = useState<SimpleRoutineType[]>();

  const fetchRoutines = async (date: Date) => {
    setIsFetching(true);
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);

    const query = `startsAt<=${midnight.toISOString()}&lastDate>=${midnight.toISOString()}`;

    const response = await callTheServer({
      endpoint: `getRoutines?${query}`,
      method: "GET",
    });

    if (response.status === 200) {
      const { data } = response.message;
      setRoutinesOnTheChosenDate(data);
      setSelectedRoutineId("");

      if (data.length > 0) {
        setSelectedRoutineId(data[0]._id);
      }
    }

    setIsFetching(false);
  };

  const routines = useMemo(() => {
    if (!routinesOnTheChosenDate) return;

    return (
      <Stack gap={12}>
        {routinesOnTheChosenDate.map((item, index) => (
          <MoveRoutineRow
            key={index}
            selectedRoutineId={selectedRoutineId}
            setSelectedRoutineId={setSelectedRoutineId}
            routine={item}
          />
        ))}
      </Stack>
    );
  }, [routinesOnTheChosenDate, selectedRoutineId]);

  const handleClickNext = async () => {
    setIsLoading(true);
    await handleClick({ selectedRoutineId, startDate });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!startDate) return;
    fetchRoutines(startDate);
  }, [startDate]);

  return (
    <Stack>
      <DatePickerInput
        value={startDate}
        onChange={setStartDate}
        placeholder="Select a starting date"
        minDate={new Date()}
      />
      <Stack>
        {isFetching ? (
          <Loader m="0 auto" pt="25%" />
        ) : (
          <>
            {routinesOnTheChosenDate && routinesOnTheChosenDate.length > 0 ? (
              <Accordion>
                <Stack gap={0}>
                  <Text ml={8} size="sm" mb={8} c="dimmed">
                    Destination routine
                  </Text>
                  {routines}
                </Stack>
              </Accordion>
            ) : (
              <OverlayWithText text="A new routine will be created" />
            )}
          </>
        )}
      </Stack>
      <Button
        loading={isLoading}
        variant="default"
        disabled={isLoading || !startDate}
        onClick={handleClickNext}
      >
        {buttonText}
      </Button>
    </Stack>
  );
}
