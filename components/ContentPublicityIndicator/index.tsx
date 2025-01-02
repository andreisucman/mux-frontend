import React, { memo } from "react";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import cn from "classnames";
import { Group } from "@mantine/core";
import classes from "./ContentPublicityIndicator.module.css";

type Props = {
  isPublic: boolean;
  showText?: boolean;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
};

function ContentPublicityIndicator({ showText, isPublic, position = "top-right" }: Props) {
  const publicityText = isPublic ? "Public" : "Private";
  const publicityIcon = isPublic ? (
    <IconLockOpen className="icon" />
  ) : (
    <IconLock className="icon" />
  );

  return (
    <Group
      className={cn(classes.container, {
        [classes[position]]: true,
      })}
    >
      {publicityIcon}
      {showText && publicityText}
    </Group>
  );
}

export default memo(ContentPublicityIndicator);
