"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import convertSecondsToTime from "@/helpers/convertSecondsToTime";
import classes from "./Timer.module.css";

type Props = {
  date: Date | null | number;
  onlyCountdown?: boolean;
  showDays?: boolean;
  onlyMinutes?: boolean;
  children?: React.ReactNode;
  onComplete?: () => void;
  customStyles?: { [key: string]: any };
};

const Timer = ({
  date,
  children,
  showDays,
  onlyMinutes,
  customStyles,
  onlyCountdown,
  onComplete,
}: Props) => {
  const containerRef = useRef(null);
  const [countdown, setCountdown] = useState(0);

  let timeDifference = 0;

  if (typeof date === "number") {
    timeDifference = date;
  } else {
    timeDifference = new Date(date || 0).getTime() - new Date().getTime();
  }

  useEffect(() => {
    if (isNaN(timeDifference)) return;

    setCountdown(Math.ceil(timeDifference / 1000));
  }, [timeDifference]);

  useEffect(() => {
    let callbackInvoked = false;

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          if (!callbackInvoked && onComplete) {
            onComplete();
            callbackInvoked = true;
          }
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <span className={classes.container} style={customStyles ? customStyles : {}} ref={containerRef}>
      {!onlyCountdown && children}
      <span>{convertSecondsToTime({ seconds: countdown, showDays, onlyMinutes })}</span>
    </span>
  );
};

export default memo(Timer);
