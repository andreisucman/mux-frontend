import React, { memo } from "react";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { Group } from "@mantine/core";
import classes from "./ContentPublicityIndicator.module.css";

type Props = {
  isPublic: boolean;
};

function ContentPublicityIndicator({ isPublic }: Props) {
  const publicityText = isPublic ? "Public" : "Private";
  const publicityIcon = isPublic ? (
    <IconLockOpen className="icon icon__small" />
  ) : (
    <IconLock className="icon icon__small" />
  );

  return (
    <Group className={classes.container}>
      {publicityIcon}
      {publicityText}
    </Group>
  );
}

export default memo(ContentPublicityIndicator);
