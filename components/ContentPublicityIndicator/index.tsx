import React, { memo } from "react";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import cn from "classnames";
import { Group } from "@mantine/core";
import classes from "./ContentPublicityIndicator.module.css";

type Props = {
  isPublic: boolean;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
};

function ContentPublicityIndicator({ isPublic, position = "top-right" }: Props) {
  const publicityText = isPublic ? "Public" : "Private";
  const publicityIcon = isPublic ? (
    <IconLockOpen className="icon icon__small" />
  ) : (
    <IconLock className="icon icon__small" />
  );

  return (
    <Group
      className={cn(classes.container, {
        [classes.topRight]: position === "top-right",
        [classes.topLeft]: position === "top-left",
        [classes.bottomRight]: position === "bottom-right",
        [classes.bottomLeft]: position === "bottom-left",
      })}
    >
      {publicityIcon}
      {publicityText}
    </Group>
  );
}

export default memo(ContentPublicityIndicator);
