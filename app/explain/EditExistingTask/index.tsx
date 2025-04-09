import React from "react";
import { IconCalendar, IconSquareRoundedCheck } from "@tabler/icons-react";
import { Group, rem, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextareaComponent from "@/components/TextAreaComponent";
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
  date,
  setDate,
  readOnly,
  updatedDescription,
  updatedInstruction,
  setUpdatedDescription,
  setUpdatedInstruction,
}: Props) {
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    <Stack flex={1}>
      {readOnly && (
        <Group className={classes.banner}>
          <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(6) }} /> Task updated
        </Group>
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
          excludeDate={(date) => new Date(date) < todayMidnight}
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
