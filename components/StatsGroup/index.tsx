import React, { memo } from "react";
import { IconListDetails, IconSquareCheck } from "@tabler/icons-react";
import { Group } from "@mantine/core";
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
      <StatCell icon={<IconListDetails className="icon icon__small" />} value={total} />
      <StatCell icon={<IconSquareCheck className="icon icon__small" />} value={completed} />
      {`% ${completionRate}`}
    </Group>
  );
}

export default memo(StatsGroup);
