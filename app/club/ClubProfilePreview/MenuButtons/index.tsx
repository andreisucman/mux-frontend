import React, { memo } from "react";
import { usePathname } from "next/navigation";
import cn from "classnames";
import { Button, Group } from "@mantine/core";
import classes from "./MenuButtons.module.css";

type Props = {
  isVertical?: boolean;
  redirectToProgress: () => void;
  redirectToRoutines: () => void;
};

function MenuButtons({ isVertical = false, redirectToProgress, redirectToRoutines }: Props) {
  const pathname = usePathname();
  const isAbout = pathname.startsWith("/club/routines");
  const isProgress = pathname.startsWith("/club/progress");

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
        variant={"default"}
        size="compact-sm"
        className={cn(classes.button, { [classes.selected]: isAbout })}
        onClick={redirectToRoutines}
      >
        Routines
      </Button>
    </Group>
  );
}

export default memo(MenuButtons);
