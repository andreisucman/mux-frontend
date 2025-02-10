import React, { memo } from "react";
import { usePathname } from "next/navigation";
import cn from "classnames";
import { Button, Group } from "@mantine/core";
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
        Progress
      </Button>
      <Button
        variant={showQuestions ? "filled" : "default"}
        size="compact-sm"
        className={cn(classes.button, { [classes.selected]: isAbout })}
        onClick={redirectToTrackingAbout}
      >
        About
      </Button>
    </Group>
  );
}

export default memo(MenuButtons);
