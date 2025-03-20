import React, { memo } from "react";
import { Button, Divider, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import Link from "@/helpers/custom-router/patch-router/link";
import { TaskType } from "@/types/global";
import TaskRow from "../TaskRow";
import classes from "./TasksSlide.module.css";

interface TaskTypeWithOnClick extends TaskType {
  onClick: () => void;
}

type Props = {
  taskGroups: TaskTypeWithOnClick[][];
  canAddDiary?: boolean;
};

function TasksSlide({ taskGroups, canAddDiary }: Props) {
  return (
    <Stack className={`${classes.container} scrollbar`}>
      {taskGroups && (
        <Stack className={classes.wrapper}>
          {canAddDiary && (
            <Button size="compact-sm" variant="default" component={Link} href={"/diary"} c="white">
              Add a diary note
            </Button>
          )}
          {taskGroups.map((group, index) => {
            const name = group[0].concern;
            const label = name.split("_").join(" ");
            return (
              <Stack key={index}>
                <Divider
                  label={
                    <Text c="dimmed" size="sm">
                      {upperFirst(label)}
                    </Text>
                  }
                />
                {group.map((t, i) => (
                  <TaskRow
                    key={i}
                    icon={t.icon}
                    onClick={t.onClick}
                    description={t.description}
                    color={t.color}
                    name={t.name}
                    startsAt={t.startsAt}
                    expiresAt={t.expiresAt}
                    status={t.status}
                  />
                ))}
              </Stack>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default memo(TasksSlide);
