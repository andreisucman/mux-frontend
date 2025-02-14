import React, { useMemo } from "react";
import { Group, rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import SuggestionContainer from "@/components/SuggestionContainer";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TaskType } from "@/types/global";
import IconWithColor from "../../tasks/TasksList/CreateTaskOverlay/IconWithColor";
import classes from "./ProductsRow.module.css";

type Props = {
  task: TaskType;
  selectedAsins: string[];
  customStyles?: { [key: string]: any };
  setUniqueTasks: React.Dispatch<React.SetStateAction<TaskType[] | undefined>>;
  setSelectedAsins: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ProductsRow({
  task,
  customStyles,
  selectedAsins,
  setSelectedAsins,
}: Props) {
  const { _id: taskId, key: taskKey, color, icon, name, suggestions, startsAt } = task;

  const date = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton}>
      <Stack className={classes.container}>
        <Group className={classes.upperPart} style={customStyles ? customStyles : {}}>
          <Text className={classes.date}>Starts: {date}</Text>
          <IconWithColor icon={icon} color={color} />
          <Text className={classes.name} lineClamp={2}>
            {name}
          </Text>
        </Group>
        <Stack flex={1}>
          <SuggestionContainer
            title="Products"
            chatTitle={
              <Group className={classes.modalTitle} style={customStyles ? customStyles : {}}>
                <IconWithColor icon={icon} color={color} customStyles={{ minHeight: rem(30) }} />
                <Title order={5} component={"p"} className={classes.name} lineClamp={1}>
                  {name} products
                </Title>
              </Group>
            }
            taskKey={taskKey}
            chatContentId={taskId}
            items={suggestions}
            customStyles={{ borderRadius: "0 0 16px 16px" }}
            selectedAsins={selectedAsins}
            setSelectedAsins={setSelectedAsins}
            showOnCellAtc={true}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}
