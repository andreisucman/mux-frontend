import React, { useCallback, useMemo } from "react";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import SuggestionContainer from "@/components/SuggestionContainer";
import callTheServer from "@/functions/callTheServer";
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
  setUniqueTasks,
  setSelectedAsins,
}: Props) {
  const { color, icon, name, productsPersonalized, suggestions, defaultSuggestions, startsAt } =
    task;

  const finalSuggestions = suggestions?.length > 0 ? suggestions : defaultSuggestions;

  const date = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const refetchTask = useCallback(async () => {
    try {
      if (!task) return;
      const response = await callTheServer({
        endpoint: "getTaskProducts",
        method: "POST",
        body: { taskId: task._id },
      });

      if (response.status === 200) {
        const updatedTask: TaskType = response.message;
        setUniqueTasks((prev) =>
          prev?.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    } catch (err) {
      console.log(`Error in refetchTask: `, err);
    }
  }, [task?._id]);

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
            items={finalSuggestions}
            customStyles={{ borderRadius: "0 0 16px 16px" }}
            taskKey={task.key}
            selectedAsins={selectedAsins}
            productsPersonalized={productsPersonalized}
            setSelectedAsins={setSelectedAsins}
            refetchTask={refetchTask}
            showOnCellAtc={true}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}
