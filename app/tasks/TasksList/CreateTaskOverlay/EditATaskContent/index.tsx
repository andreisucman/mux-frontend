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

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const previewBody = previewIsTasks ? (
    <Stack className={`${classes.tasksPreviewContainer} scrollbar`}>
      {previewData.map((data, index) => {
        return <NewTaskPreviewRow {...(data as TaskPreviewRecord)} key={index} />;
      })}
    </Stack>
  ) : (
    <Text size="sm">{previewData.join(", ")}</Text>
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
          <Group justify="space-between" align="center">
            <Text className={classes.label}>Description</Text>
            {description && (
              <Text size="xs" c="dimmed" mr={16}>
                {description.length}
              </Text>
            )}
          </Group>
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
          <Group justify="space-between" align="center">
            <Text className={classes.label}>Instruction</Text>
            {instruction && (
              <Text size="xs" c="dimmed" mr={16}>
                {instruction.length}
              </Text>
            )}
          </Group>
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
              size="sm"
              maw={rem(100)}
              value={frequency}
              onChange={(value) => {
                if (!setFrequency) return;
                setFrequency(Math.min(Math.max(Number(value), 1), 70));
              }}
              clampBehavior="strict"
              readOnly={readOnly}
            />
            <Text size="sm">time(s) a week</Text>
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
          excludeDate={(date) =>
            new Date(date) < todayMidnight || new Date(date) > latestDateOfWeek
          }
          placeholder="Pick date"
          size="sm"
          closeOnChange
          leftSection={<IconCalendar className="icon" stroke={1.5} />}
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
