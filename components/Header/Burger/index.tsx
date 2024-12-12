import React, { memo } from "react";
import classes from "./Burger.module.css";

type Props = {
  onClick: () => void;
};

function Burger({ onClick }: Props) {
  return (
    <div className={classes.container} onClick={onClick}>
      <div className={classes.stick} />
      <div className={classes.stick} />
      <div className={classes.stick} />
    </div>
  );
}

export default memo(Burger);
