import React, { useMemo, useState } from "react";
import { IconListDetails, IconNotebook, IconRoute, IconVideo } from "@tabler/icons-react";
import { Group, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { RoutineDataStatsType } from "@/types/global";
import classes from "./RoutineStats.module.css";

type Props = {
  stats: RoutineDataStatsType;
};

export default function RoutineStats({ stats }: Props) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(null));

  const content = useMemo(() => {
    const parts = [];

    const completed = stats.completedTasks;

    const proofRate = Math.round(
      completed ? (stats.completedTasksWithProof / stats.completedTasks) * 100 : 0
    );

    parts.push(
      {
        name: "Routines",
        icon: <IconRoute size={20} />,
        value: stats.routines,
      },
      {
        name: "Completed tasks",
        icon: <IconListDetails size={20} />,
        value: stats.completedTasks,
      },
      {
        name: "Proof rate",
        icon: <IconVideo size={20} />,
        value: `${proofRate}%`,
      },
      {
        name: "Diary",
        icon: <IconNotebook size={20} />,
        value: stats.diaryRecords,
      }
    );

    return (
      <>
        <Group className={classes.group}>
          {...parts.slice(0, 2).map((p, i) => (
            <Tooltip
              key={i}
              opened={p.name?.toLowerCase() === openTooltip?.toLowerCase()}
              label={p.name}
              ref={clickOutsideRef}
              onClick={() => setOpenTooltip(p.name)}
              multiline
            >
              <Group className={classes.box} variant="default">
                {p.icon}
                <span className={classes.value}>{p.value}</span>
              </Group>
            </Tooltip>
          ))}
        </Group>
        <Group className={classes.group}>
          {...parts.slice(2).map((p, i) => (
            <Tooltip
              key={i}
              opened={p.name?.toLowerCase() === openTooltip?.toLowerCase()}
              label={p.name}
              ref={clickOutsideRef}
              onClick={() => setOpenTooltip(p.name)}
              multiline
            >
              <Group className={classes.box} variant="default">
                {p.icon}
                <span className={classes.value}>{p.value}</span>
              </Group>
            </Tooltip>
          ))}
        </Group>
      </>
    );
  }, [stats, openTooltip]);
  return <Group className={classes.container}>{content}</Group>;
}
