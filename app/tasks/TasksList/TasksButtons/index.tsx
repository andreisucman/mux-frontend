"use client";

import React, { useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconCirclePlus,
  IconListDetails,
  IconRoute,
  IconTrophy,
} from "@tabler/icons-react";
import { Button, Group, rem, Text, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { defaultStreaks } from "@/app/rewards/RewardCard/defaultStreaks";
import StreaksButton from "@/components/StreaksButton";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openCreateNewTask from "../CreateTaskOverlay/openCreateNewTask";
import classes from "./TasksButtons.module.css";

type Props = {
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  disableCreateTask?: boolean;
};

export default function TasksButtons({ handleSaveTask, disableCreateTask }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userDetails } = useContext(UserContext);
  const { latestProgressImages } = userDetails || {};

  const { onCreateRoutineClick } = useContext(CreateRoutineContext);

  const notScanned = useMemo(() => {
    const values = Object.keys(latestProgressImages || {});
    return values.filter(Boolean).length === 0;
  }, [latestProgressImages]);

  const onCreateManuallyClick = () => {
    if (notScanned) {
      openErrorModal({
        title: "Please scan yourself",
        description: (
          <Text>
            You need to scan yourself to be able to create tasks. Click{" "}
            <UnstyledButton
              onClick={() => {
                router.push("/scan");
                modals.closeAll();
              }}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              here
            </UnstyledButton>{" "}
            to start.
          </Text>
        ),
      });
      return;
    }
    openCreateNewTask({ handleSaveTask, onCreateRoutineClick });
  };

  return (
    <Group className={classes.container}>
      <StreaksButton streaks={userDetails?.streaks || defaultStreaks} />
      <Group className={classes.wrapper}>
        <Button
          className={classes.button}
          variant="default"
          size="xs"
          onClick={() => router.push("/rewards")}
        >
          <IconTrophy style={{ width: rem(20) }} />
        </Button>
        <Button
          className={classes.button}
          variant="default"
          size="xs"
          onClick={() => router.push("/calendar")}
        >
          <IconCalendar style={{ width: rem(20) }} />
        </Button>
        {pathname === "/tasks" && (
          <Button
            className={classes.button}
            variant="default"
            size="xs"
            onClick={() => router.push("/routines")}
          >
            <IconRoute style={{ width: rem(20) }} />
          </Button>
        )}
        {pathname === "/routines" && (
          <Button
            className={classes.button}
            variant="default"
            size="xs"
            onClick={() => router.push("/tasks")}
          >
            <IconListDetails style={{ width: rem(20) }} />
          </Button>
        )}
        <Button
          className={classes.button}
          disabled={disableCreateTask}
          variant="default"
          size="xs"
          onClick={onCreateManuallyClick}
        >
          <IconCirclePlus style={{ width: rem(20) }} />
        </Button>
      </Group>
    </Group>
  );
}
