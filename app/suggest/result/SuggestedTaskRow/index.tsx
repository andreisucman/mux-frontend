import React, { useMemo } from "react";
import { Group, rem, Skeleton, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import classes from "./SuggestedTaskRow.module.css";

type Props = {
  color: string;
  name: string;
  icon?: string;
  numberOfTimesInAMonth: number;
};

export default function SuggestedTaskRow({ color, name, icon, numberOfTimesInAMonth }: Props) {
  const showSkeleton = useShowSkeleton();

  const normalizedData = useMemo(() => {
    return {
      name: normalizeString(name),
      count: Math.max(Math.round(numberOfTimesInAMonth / 4.285714301020408), 1),
    };
  }, [name, numberOfTimesInAMonth]);

  const countText =
    normalizedData.count > 1 ? `${normalizedData.count} times` : `${normalizedData.count} time`;

  return (
    <Skeleton visible={showSkeleton} className={classes.skeleton}>
      <Group className={classes.container}>
        <IconWithColor
          icon={icon || ""}
          color={color}
          customStyles={{
            fontSize: rem(22),
            minWidth: rem(50),
          }}
        />
        <Group className={classes.content}>
          <Text lineClamp={2}>{normalizedData.name}</Text>
          <Text className={classes.count}>{countText}</Text>
        </Group>
      </Group>
    </Skeleton>
  );
}
