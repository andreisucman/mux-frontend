import React, { useMemo, useState } from "react";
import { IconCircleCheck, IconPlus } from "@tabler/icons-react";
import { Button, rem, Stack, Text } from "@mantine/core";
import EditATaskContent from "@/app/tasks/TasksList/CreateTaskOverlay/EditATaskContent";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import { AllTaskType } from "@/types/global";
import classes from "./TaskInfoContainer.module.css";

type Props = {
  alreadyExists?: boolean;
  isEdit?: boolean;
  rawTask: AllTaskType;
  onSubmit: (total: number, startingDate: Date | null) => Promise<boolean>;
};

export default function TaskInfoContainer({ rawTask, isEdit, onSubmit, alreadyExists }: Props) {
  const [disableAdd, setDisableAdd] = useState(alreadyExists);
  const [date, setDate] = useState<Date | null>(new Date());
  const { description, instruction, total, name, color, icon } = rawTask;

  const taskPreviews = useMemo(() => {
    const previews: {
      name: string;
      icon: string;
      color: string;
      date: string;
    }[] = [];

    const distance = Math.round(Math.max(7 / total, 1));

    for (let i = 0; i < Math.min(total, 7); i++) {
      const finalDate = daysFrom({
        date: date instanceof Date ? date : new Date(),
        days: distance * i,
      });
      previews.push({
        name,
        color,
        icon,
        date: formatDate({ date: finalDate }),
      });
    }

    return previews;
  }, [date]);

  const finalIcon = isEdit ? (
    <IconCircleCheck className="icon" />
  ) : (
    <IconPlus className="icon" style={{ marginRight: rem(6) }} />
  );

  return (
    <Stack flex={1}>
      <EditATaskContent
        date={date}
        rawTask={{ description, instruction }}
        frequency={total}
        previewData={taskPreviews}
        setDate={setDate}
        previewIsTasks
        readOnly
      />
      <Stack gap={rem(8)}>
        <Button
          variant="default"
          className={classes.button}
          disabled={disableAdd}
          onClick={() => {
            onSubmit(total, date).then((res) => {
              if (res && !isEdit) setDisableAdd(true);
            });
          }}
        >
          {finalIcon}
          <Text className={classes.buttonText}>{isEdit ? "Edit task" : "Add to routine"}</Text>
        </Button>
        {disableAdd && !isEdit && (
          <Text c="dimmed" className={classes.text}>
            This task is already in your routine
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
