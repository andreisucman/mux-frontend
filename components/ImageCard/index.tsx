import React from "react";
import Image from "next/image";
import cn from "classnames";
import { Text } from "@mantine/core";
import classes from "./ImageCard.module.css";

type Props = {
  image?: string;
  date?: string;
  showDate?: boolean;
  child?: React.ReactNode;
  datePosition?: "top-left" | "bottom-right";
  onClick?: () => void;
  customStyles?: { [key: string]: any };
};

export default function ImageCard({
  image,
  date,
  child,
  showDate,
  datePosition = "bottom-right",
  customStyles,
  onClick,
}: Props) {
  return (
    <div className={classes.container} style={customStyles ? customStyles : {}} onClick={onClick}>
      <div className={classes.imageWrapper}>
        <Image className={classes.image} src={image || ""} width={300} height={400} alt="" />
      </div>

      {showDate && date && (
        <Text
          className={cn(classes.date, {
            [classes.topLeft]: datePosition === "top-left",
          })}
        >
          {date}
        </Text>
      )}
      {child}
    </div>
  );
}
