import React, { memo } from "react";
import { usePathname } from "next/navigation";
import { IconClipboardData, IconNotes } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, rem, Text } from "@mantine/core";
import classes from "./MenuButtons.module.css";

type Props = {
  type: "you" | "member";
  hasQuestions: boolean;
  isVertical?: boolean;
  redirectToProgress: () => void;
  redirectToTrackingAbout: () => void;
};

function MenuButtons({
  type,
  hasQuestions,
  isVertical = false,
  redirectToProgress,
  redirectToTrackingAbout,
}: Props) {
  const pathname = usePathname();
  const isAbout = pathname.startsWith("/club/about");
  const isProgress = pathname.startsWith("/club/progress");

  const showQuestions = type === "you" && hasQuestions && !isAbout;

  return (
    <Group className={cn(classes.container, { [classes.vertical]: isVertical })}>
      <Button
        variant={"default"}
        size="compact-sm"
        className={cn(classes.button, { [classes.selected]: isProgress })}
        onClick={redirectToProgress}
      >
        <Text className={classes.buttonText}>Progress</Text>
      </Button>
      <Button
        variant={showQuestions ? "filled" : "default"}
        size="compact-sm"
        className={cn(classes.button, { [classes.selected]: isAbout })}
        onClick={redirectToTrackingAbout}
      >
        <Text
          className={cn(classes.buttonText, {
            [classes.activeButtonText]: showQuestions,
          })}
        >
          About
        </Text>
      </Button>
    </Group>
  );
}

export default memo(MenuButtons);
