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
  position?: "right" | "left";
  datePosition?: "top-left" | "bottom-right";
  onClick?: () => void;
  limitMaxHeight?: boolean;
  customStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
  customImageStyles?: { [key: string]: any };
};

export default function ImageCard({
  image,
  date,
  child,
  isRelative,
  limitMaxHeight,
  showDate,
  position,
  datePosition = "bottom-right",
  customWrapperStyles,
  customImageStyles,
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
          className={cn(classes.image, {
            [classes.relative]: isRelative,
            [classes.left]: position === "left",
            [classes.right]: position === "right",
            [classes.limitMaxHeight]: limitMaxHeight,
          })}
          style={customImageStyles ? customImageStyles : {}}
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
