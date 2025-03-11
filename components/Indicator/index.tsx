import React from "react";
import cn from "classnames";
import classes from "./Indicator.module.css";

type Props = {
  status: string;
  customStyles?: { [key: string]: any };
};

export default function Indicator({ status, customStyles }: Props) {
  return (
    <div
      className={cn(classes.container, {
        [classes.active]: status === "active",
        [classes.completed]: status === "completed",
        [classes.inactive]: status === "inactive",
      })}
      style={customStyles || {}}
    />
  );
}
