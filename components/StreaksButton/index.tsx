import React, { memo, useCallback, useMemo } from "react";
import { IconFlame, IconFlameFilled } from "@tabler/icons-react";
import { RingProgress, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { StreaksType } from "@/types/global";
import StreaksModalContent from "./StreaksModalContent";
import classes from "./StreaksButton.module.css";

type Props = {
  streaks: StreaksType;
  customRingStyles?: { [key: string]: any };
};

function StreaksButton({ streaks, customRingStyles }: Props) {
  const sortedStreakEntries = useMemo(
    () => Object.entries(streaks).sort((a, b) => b[1] - a[1]),
    [streaks]
  );

  const streaksSections = useMemo(
    () =>
      sortedStreakEntries.map((gr) => ({
        key: gr[0],
        value: gr[1],
      })),
    [sortedStreakEntries]
  );

  const buttonData = useMemo(() => {
    const hasAnyStreaks = sortedStreakEntries.some((str) => str[1] > 0);

    const sections = [];
    let icon = null;

    if (hasAnyStreaks) {
      sections.push({ value: 100, color: "var(--mantine-color-green-7)" });
      icon = <IconFlameFilled className={classes.icon} color={"var(--mantine-color-orange-7)"} />;
    } else {
      sections.push({
        value: 0,
        color: "var(--mantine-color-dark-4)",
      });
      icon = <IconFlame className={classes.icon} color="white" />;
    }

    return { sections, icon };
  }, [sortedStreakEntries]);

  const openStreaksModal = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: <Title component="div" order={5}>Streaks</Title>,
      centered: true,
      innerProps: <StreaksModalContent streaksSections={streaksSections} />,
    });
  }, [streaksSections]);

  return (
    <RingProgress
      size={40}
      thickness={5}
      label={buttonData.icon}
      sections={buttonData.sections}
      styles={customRingStyles}
      classNames={{ label: classes.label }}
      onClick={openStreaksModal}
    />
  );
}

export default memo(StreaksButton);
