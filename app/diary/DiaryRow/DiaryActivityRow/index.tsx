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
    <div className={`${classes.container} scrollbar`}>
      <div className={classes.wrapper}>
        {activities.map((activity, index) => (
          <DiaryTaskCard {...activity} key={index} />
        ))}
      </div>
    </div>
  );
}

export default memo(DiaryActivityRow);
