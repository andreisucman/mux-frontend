"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconCirclePlus,
  IconListDetails,
  IconRoute,
  IconShoppingBag,
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
  const { timeZone, nextScan } = userDetails || {};

  const { onCreateRoutineClick } = useContext(CreateRoutineContext);

  const onCreateManuallyClick = () => {
    const partsScanned = nextScan?.filter((obj) => Boolean(obj.date));
    if (!partsScanned || partsScanned.length === 0) {
      openErrorModal({
        title: "🚨 Please scan yourself",
        description: (
          <Text>
            You need to scan yourself to be able to create tasks. Click{" "}
            <UnstyledButton
              onClick={() => {
                router.push("/scan/progress");
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
    openCreateNewTask({ timeZone, handleSaveTask, onCreateRoutineClick });
  };

  return (
    <Group className={classes.container}>
      <StreaksButton streaks={userDetails?.streaks || defaultStreaks} />
      <Group className={classes.wrapper}>
        <Button
          className={classes.button}
          variant="default"
          size="xs"
          onClick={() => router.push("/products")}
        >
          <IconShoppingBag style={{ width: rem(20) }} />
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
