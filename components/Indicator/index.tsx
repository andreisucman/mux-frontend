import React from "react";
import cn from "classnames";
import classes from "./Indicator.module.css";

type Props = {
  status: string;
};

export default function Indicator({ status }: Props) {
  return (
    <div
      className={cn(classes.container, {
        [classes.active]: ["active", "replaced"].includes(status),
        [classes.completed]: status === "completed",
        [classes.inactive]: status === "inactive",
      })}
    />
  );
}
