import React, { memo } from "react";
import { IconLock, IconLockOff } from "@tabler/icons-react";
import { Group, ThemeIcon } from "@mantine/core";
import classes from "./ContentPublicityIndicator.module.css";

type Props = {
  isPublic: boolean;
};

function ContentPublicityIndicator({ isPublic }: Props) {
  const publicityText = isPublic ? "Public" : "Private";
  const publicityIcon = isPublic ? (
    <IconLock className="icon icon__small" />
  ) : (
    <IconLockOff className="icon icon__small" />
  );
  const color = isPublic ? "green.7" : "red.7";

  return (
    <Group className={classes.container}>
      <ThemeIcon color={color} variant="light">
        {publicityIcon}
      </ThemeIcon>
      {publicityText}
    </Group>
  );
}

export default memo(ContentPublicityIndicator);
