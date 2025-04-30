import React, { memo } from "react";
import cn from "classnames";
import { DiaryActivityType } from "../../../app/diary/type";
import DiaryTaskCard from "../../DiaryTaskCard";
import classes from "./DiaryActivityRow.module.css";

type Props = {
  activities: DiaryActivityType[];
};

function DiaryActivityRow({ activities }: Props) {
  return (
    <div className={cn(classes.container, "scrollbar")}>
      <div className={classes.wrapper}>
        {activities.map((activity, index) => (
          <DiaryTaskCard {...activity} key={index} />
        ))}
      </div>
    </div>
  );
}

export default memo(DiaryActivityRow);
