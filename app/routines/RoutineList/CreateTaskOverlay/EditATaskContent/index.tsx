import React, { memo } from "react";
import { IconCalendar } from "@tabler/icons-react";
import { Group, NumberInput, rem, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import TextareaComponent from "@/components/TextAreaComponent";
import { daysFrom } from "@/helpers/utils";
import { RawTaskType } from "../AddATaskContainer/types";
import NewTaskPreviewRow from "../NewTaskPreviewRow";
import classes from "./EditATaskContent.module.css";

type TaskPreviewRecord = {
  name: string;
  icon: string;
  color: string;
  date: string;
};

type Props = {
  previewIsTasks?: boolean;
  previewData: string[] | TaskPreviewRecord[];
  rawTask?: RawTaskType;
  tasksLeft?: number;
  frequency: number;
  readOnly?: boolean;
  date: Date | null;
  setRawTask?: React.Dispatch<React.SetStateAction<RawTaskType | undefined>>;
  setFrequency?: React.Dispatch<React.SetStateAction<number>>;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

function EditATaskContent({
  date,
  rawTask,
  frequency,
  tasksLeft,
  previewData,
  previewIsTasks,
  readOnly,
  setRawTask,
  setFrequency,
  setDate,
}: Props) {
  const { description, instruction } = rawTask || {};
  const latestDateOfWeek = daysFrom({ days: 7 });
  const previeTitle = previewIsTasks ? "Tasks preview:" : "Dates preview:";

  const previewBody = previewIsTasks ? (
    <Stack className={classes.tasksPreviewContainer}>
      {previewData.map((data, index) => {
        const multiple = frequency / 7;
        const current = frequency - multiple * index > 7 ? multiple : 1;
        return (
          <NewTaskPreviewRow {...(data as TaskPreviewRecord)} numberOfTasks={current} key={index} />
        );
      })}
    </Stack>
  ) : (
    <Group>
      <Text>{previewData.slice(0, 3).join(", ")}</Text>
      {tasksLeft && tasksLeft > 1 && (
        <Text size="xs" c="dimmed" ta="center">
          and {tasksLeft} more days...
        </Text>
      )}
    </Group>
  );

  return (
    <Stack className={classes.container}>
      <TextareaComponent
        text={description}
        setText={(text) => {
          if (!setRawTask) return;
          const updated = {
            ...rawTask,
            description: text,
          };
          setRawTask(updated as RawTaskType);
        }}
        heading={
          <Text size="xs" c="dimmed">
            Description:
          </Text>
        }
        placeholder={"Task description"}
        readOnly={readOnly}
      />
      <TextareaComponent
        text={instruction}
        setText={(text) => {
          if (!setRawTask) return;
          const updated = {
            ...rawTask,
            instruction: text,
          };
          setRawTask(updated as RawTaskType);
        }}
        heading={
          <Text size="xs" c="dimmed">
            Instruction:
          </Text>
        }
        placeholder={"Task instruction"}
        readOnly={readOnly}
      />
      {!readOnly && (
        <Stack className={classes.box}>
          <Text size="xs" c="dimmed">
            Frequency:
          </Text>
          <Group wrap="nowrap" align="center">
            <NumberInput
              max={70}
              min={1}
              size="md"
              maw={rem(100)}
              value={frequency}
              onChange={(value) => {
                if (!setFrequency) return;
                setFrequency(Math.min(Math.max(Number(value), 1), 70));
              }}
              clampBehavior="strict"
              readOnly={readOnly}
            />{" "}
            time(s) a week
          </Group>
        </Stack>
      )}
      <Stack className={classes.box}>
        <Text size="xs" c="dimmed">
          Choose a starting date:
        </Text>
        <DatePickerInput
          value={date}
          onChange={setDate}
          excludeDate={(date) => new Date(date) < new Date() || new Date(date) > latestDateOfWeek}
          placeholder="Pick date"
          size="sm"
          closeOnChange
          leftSection={<IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        />
      </Stack>
      <Stack className={classes.box}>
        <Text size="xs" c="dimmed">
          {previeTitle}
        </Text>
        {previewBody}
      </Stack>
    </Stack>
  );
}

export default memo(EditATaskContent);
