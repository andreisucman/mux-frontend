import React, { useMemo, useState } from "react";
import { IconArrowBack, IconX } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, NumberInput, rem, Skeleton, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import classes from "./SuggestedTaskRow.module.css";

type Props = {
  color: string;
  name: string;
  icon?: string;
  numberOfTimesInAMonth: number;
  setTaskCountMap: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};

export default function SuggestedTaskRow({
  color,
  name,
  icon,
  numberOfTimesInAMonth,
  setTaskCountMap,
}: Props) {
  const showSkeleton = useShowSkeleton();
  const [count, setCount] = useState(numberOfTimesInAMonth);

  const handleSetCount = (name: string, newCount: number) => {
    setCount(newCount);
    setTaskCountMap((prev) => ({ ...prev, [name]: newCount }));
  };

  const normalizedData = useMemo(() => {
    return {
      name: normalizeString(name),
      count: Math.max(
        Math.round(numberOfTimesInAMonth / Number(process.env.NEXT_PUBLIC_WEEKLY_MULTIPLIER)),
        1
      ),
    };
  }, [name, numberOfTimesInAMonth]);

  const actionButton = useMemo(() => {
    if (count > 0) {
      return (
        <ActionIcon variant="default" onClick={() => handleSetCount(name, 0)}>
          <IconX size={16} />
        </ActionIcon>
      );
    } else {
      return (
        <ActionIcon variant="default" onClick={() => handleSetCount(name, 1)}>
          <IconArrowBack size={16} />
        </ActionIcon>
      );
    }
  }, [count]);

  return (
    <Skeleton visible={showSkeleton} className={classes.skeleton}>
      <Group className={cn(classes.container, { [classes.deleted]: count === 0 })}>
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
          <NumberInput
            value={count}
            min={0}
            ml="auto"
            miw={60}
            clampBehavior="strict"
            placeholder="Number of times in a week"
            onChange={(number) => handleSetCount(name, Number(number))}
          />
          <Text>{count === 1 ? "time" : "times"}</Text>
          {actionButton}
        </Group>
      </Group>
    </Skeleton>
  );
}
