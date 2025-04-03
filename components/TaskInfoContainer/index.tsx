import React, { useMemo, useState } from "react";
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
  onSubmit: (total: number, startDate: Date | null) => Promise<boolean>;
};

export default function TaskInfoContainer({ rawTask, isEdit, onSubmit, alreadyExists }: Props) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleClick = async () => {
    setIsLoading(true);
    const res = await onSubmit(total, date);
    if (res && !isEdit) setDisableAdd(true);
    setIsLoading(false);
  };

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
          disabled={isLoading || disableAdd}
          loading={isLoading}
          onClick={handleClick}
        >
          {isEdit ? "Edit task" : "Copy task"}
        </Button>
        {disableAdd && !isEdit && (
          <Text c="green.7" className={classes.text}>
            Task added to your routine
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
