import React from "react";
import cn from "classnames";
import classes from "./Indicator.module.css";

type Props = {
  status: string;
  shape?: "round" | "line";
  isStatic?: boolean;
  customStyles?: { [key: string]: any };
};

export default function Indicator({ status, shape = "line", isStatic, customStyles }: Props) {
  
  return (
    <div
      className={cn(classes.container, {
        [classes.active]: status === "active",
        [classes.completed]: status === "completed",
        [classes.inactive]: status === "inactive",
        [classes.static]: isStatic,
        [classes.round]: shape === "round",
      })}
      style={customStyles || {}}
    />
  );
}
