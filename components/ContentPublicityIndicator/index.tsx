import React, { memo } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import cn from "classnames";
import { Group, ThemeIcon } from "@mantine/core";
import classes from "./ContentPublicityIndicator.module.css";

type Props = {
  isPublic: boolean;
  withIcon?: boolean;
  showText?: boolean;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
};

function ContentPublicityIndicator({
  showText,
  withIcon,
  isPublic,
  position = "top-right",
}: Props) {
  const publicityText = isPublic ? "Public" : "Private";
  const publicityIcon = isPublic ? <IconEye size={20} /> : <IconEyeOff size={20} />;

  return (
    <Group
      className={cn(classes.container, {
        [classes[position]]: true,
      })}
    >
      {withIcon ? <ThemeIcon variant="default">{publicityIcon}</ThemeIcon> : publicityIcon}
      {showText && publicityText}
    </Group>
  );
}

export default memo(ContentPublicityIndicator);
