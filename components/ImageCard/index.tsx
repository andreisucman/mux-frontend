import React from "react";
import Image from "next/image";
import cn from "classnames";
import { Text } from "@mantine/core";
import classes from "./ImageCard.module.css";

type Props = {
  image?: string;
  date?: string;
  isRelative?: boolean;
  showDate?: boolean;
  child?: React.ReactNode;
  datePosition?: "top-left" | "bottom-right";
  onClick?: () => void;
  customStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
};

export default function ImageCard({
  image,
  date,
  child,
  isRelative,
  showDate,
  datePosition = "bottom-right",
  customWrapperStyles,
  customStyles,
  onClick,
}: Props) {
  return (
    <div
      className={cn(classes.container, { [classes.relative]: isRelative })}
      style={customStyles ? customStyles : {}}
      onClick={onClick}
    >
      <div className={classes.imageWrapper} style={customWrapperStyles ? customWrapperStyles : {}}>
        <Image
          className={cn(classes.image, { [classes.relative]: isRelative })}
          src={image || ""}
          width={300}
          height={400}
          alt=""
          priority
        />
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
