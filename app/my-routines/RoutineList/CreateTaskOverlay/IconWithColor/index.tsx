import React from "react";
import classes from "./IconWithColor.module.css";

type Props = {
  color?: string;
  icon: string;
  customStyles?: { [key: string]: any };
};

export default function IconWithColor({ icon, color, customStyles }: Props) {
  const style = customStyles
    ? { ...customStyles, backgroundColor: color }
    : { backgroundColor: color };
  return (
    <div className={classes.container} style={style}>
      {icon}
    </div>
  );
}
