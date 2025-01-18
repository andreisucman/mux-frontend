import React, { memo } from "react";
import { IconList, IconSquareCheck } from "@tabler/icons-react";
import cn from "classnames";
import { Group, Text } from "@mantine/core";
import StatCell from "../AccordionTaskRow/StatCell";
import classes from "./StatsGroup.module.css";

type Props = {
  total: number;
  completed: number;
  completionRate: number;
  isChild?: boolean;
};

function StatsGroup({ total, completed, completionRate, isChild }: Props) {
  return (
    <Group className={classes.container}>
      <StatCell icon={<IconList className="icon icon__small" />} value={total} isChild={isChild} />
      <StatCell
        icon={<IconSquareCheck className="icon icon__small" />}
        value={completed}
        isChild={isChild}
      />
      <Text className={cn(classes.text, { [classes.isChild]: isChild })}>({completionRate}%)</Text>
    </Group>
  );
}

export default memo(StatsGroup);
