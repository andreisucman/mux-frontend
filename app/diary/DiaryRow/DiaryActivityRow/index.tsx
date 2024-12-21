import React, { memo } from "react";
import { Group } from "@mantine/core";
import DiaryTaskCard from "../../DiaryTaskCard";
import { DiaryActivityType } from "../../type";
import classes from "./DiaryActivityRow.module.css";

type Props = {
  activities: DiaryActivityType[];
};

function DiaryActivityRow({ activities }: Props) {
  return (
    <Group className={`${classes.container} scrollbar`}>
      <Group className={classes.wrapper}>
        {activities.map((activity, index) => (
          <DiaryTaskCard {...activity} key={index} />
        ))}
      </Group>
    </Group>
  );
}

export default memo(DiaryActivityRow);
