import React from "react";
import { IconCalendar, IconSquareRoundedCheck } from "@tabler/icons-react";
import { rem, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextareaComponent from "@/components/TextAreaComponent";
import { daysFrom } from "@/helpers/utils";
import classes from "./EditExistingTask.module.css";

type Props = {
  readOnly?: boolean;
  date: Date | null;
  updatedDescription: string;
  updatedInstruction: string;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setUpdatedDescription: React.Dispatch<React.SetStateAction<string>>;
  setUpdatedInstruction: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditExistingTask({
  readOnly,
  date,
  updatedDescription,
  updatedInstruction,
  setUpdatedDescription,
  setUpdatedInstruction,
  setDate,
}: Props) {
  const latestDateOfWeek = daysFrom({ days: 7 });

  return (
    <Stack flex={1}>
      {readOnly && (
        <Text ta="center">
          <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(8) }} /> Task updated
        </Text>
      )}
      <TextareaComponent
        text={updatedDescription}
        setText={setUpdatedDescription}
        readOnly={readOnly}
        heading={
          <Text size="xs" c="dimmed">
            Description:
          </Text>
        }
        placeholder="Updated description of the task"
      />
      <TextareaComponent
        text={updatedInstruction}
        setText={setUpdatedInstruction}
        readOnly={readOnly}
        heading={
          <Text size="xs" c="dimmed">
            Instruction:
          </Text>
        }
        placeholder="Updated instruction of the task"
      />
      <Stack className={classes.box}>
        <Text size="xs" c="dimmed">
          Starting date:
        </Text>
        <DatePickerInput
          value={date}
          onChange={setDate}
          excludeDate={(date) => new Date(date) < new Date() || new Date(date) > latestDateOfWeek}
          placeholder="Pick date"
          size="sm"
          closeOnChange
          disabled={readOnly}
          leftSection={<IconCalendar className="icon" stroke={1.5} />}
        />
      </Stack>
    </Stack>
  );
}
