import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type Props = {
  buttonText: string;
  onSubmit: ({ startDate }: { startDate: Date | null }) => Promise<string | undefined> | void;
};

export default function SelectDateModalContent({ buttonText, onSubmit }: Props) {
  const [recreateTaskOnDate, setRecreateTaskOnDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setIsLoading(true);
    const newTaskId = await onSubmit({
      startDate: recreateTaskOnDate,
    });
    if (newTaskId) router.replace(`/explain/${newTaskId}`);
    setIsLoading(false);
  };

  return (
    <Stack flex={1}>
      <DatePickerInput
        value={recreateTaskOnDate}
        onChange={setRecreateTaskOnDate}
        placeholder="Select starting date"
        minDate={new Date()}
      />
      <Button
        loading={isLoading}
        disabled={isLoading || !recreateTaskOnDate}
        variant="default"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Stack>
  );
}
