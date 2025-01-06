import React, { useMemo } from "react";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
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
  const { color, icon, name, suggestions, defaultSuggestions, startsAt } = task;

  const finalSuggestions = suggestions?.length > 0 ? suggestions : defaultSuggestions;

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
            taskId={task._id}
            items={finalSuggestions}
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
