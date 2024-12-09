"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Group, rem, Loader, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import IconWithColor from "@/app/routines/RoutineList/CreateTaskOverlay/IconWithColor";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { AllTaskType, RoutineType, TypeEnum, UserDataType } from "@/types/global";
import ClubHeader from "../ClubHeader";
import ClubModerationLayout from "../ModerationLayout";
import AccordionRoutineRow from "./AccordionRoutineRow";
import TaskInfoContainer from "./TaskInfoContainer";
import classes from "./routine.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserId: string | null;
  type?: string;
  routines?: RoutineType[];
};

export default function ClubRoutine() {
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();

  const { _id: userId, routines: currentUserRoutines } = userDetails || {};

  const type = searchParams.get("type") || "head";
  const followingUserId = searchParams.get("followingUserId");
  const isSelf = userId === followingUserId;

  const openTaskDetails = useCallback(
    (task: AllTaskType, routineId: string) => {
      try {
        const relevantRoutine = currentUserRoutines?.find((r) => r.type === type);
        const existingTasksKeys = relevantRoutine?.allTasks.map((t) => t.key);
        const existsInRoutines = existingTasksKeys?.includes(task.key) || false;

        modals.openContextModal({
          modal: "general",
          title: (
            <Group gap={rem(8)}>
              <IconWithColor
                icon={task.icon}
                customStyles={{ minHeight: rem(24), minWidth: rem(24) }}
              />
              <Text>{task.name} preview</Text>
            </Group>
          ),
          centered: true,
          innerProps: (
            <TaskInfoContainer
              rawTask={task}
              onSubmit={async (total: number, startsAt: Date | null) =>
                handleAddToMyRoutine(task.key, routineId, total, startsAt)
              }
              alreadyExists={existsInRoutines}
            />
          ),
        });
      } catch (err) {
        console.log("Error in openTaskDetails: ", err);
      }
    },
    [type, currentUserRoutines?.length]
  );

  const handleReplaceRoutine = useCallback(async (routineId: string) => {
    try {
      modals.openConfirmModal({
        title: "⚠️ Confirm routine replacement",
        children:
          "This action will replace your current routine with the selected one. Are you sure?",
        labels: { confirm: "Yes", cancel: "No" },
        onConfirm: () => replaceRoutine(routineId),
        onCancel: () => modals.closeAll(),
        centered: true,
      });
    } catch (err) {
      console.log("Error in handleReplaceRoutine: ", err);
    }
  }, []);

  const getTrackedRoutines = useCallback(
    async ({ skip, followingUserId, routines, type }: GetRoutinesProps) => {
      if (!type) return;
      try {
        let endpoint = "getTrackedRoutines";

        if (followingUserId) endpoint += `/${followingUserId}`;

        const parts = [];

        if (type) {
          parts.push(`type=${type}`);
        }

        if (skip && routines) {
          parts.push(`skip=${routines.length}`);
        }

        const query = parts.join("&");

        if (query) endpoint += `?${query}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (response.error) {
            return;
          }

          if (response.message) {
            setRoutines((prev) => [...(prev || []), ...response.message]);
            setHasMore(response.message.length === 9);

            if (!openValue) setOpenValue(response.message[0]?._id);
          }
        }
      } catch (err) {
        console.log("Error in getTrackedRoutines: ", err);
      }
    },
    []
  );

  const replaceRoutine = useCallback(async (routineId: string) => {
    try {
      const response = await callTheServer({
        endpoint: "replaceRoutine",
        method: "POST",
        body: { type, routineId },
      });

      if (response.status === 200) {
        const { routines, tasks } = response.message;
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          routines,
          tasks,
        }));
      }
    } catch (err) {
      console.log("Error in replaceRoutine: ", err);
    }
  }, []);

  const handleAddToMyRoutine = useCallback(
    async (taskKey: string, routineId: string, total: number, startsAt: Date | null) => {
      if (!taskKey || !routineId || !startsAt || !type) return false;

      try {
        const response = await callTheServer({
          endpoint: "addTaskToRoutine",
          method: "POST",
          body: { taskKey, routineId, total, followingUserId, type },
        });

        if (response.status === 200) {
          const { routine, tasks } = response.message;
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            routines: [...(prev.routines || []), routine],
            tasks: [...(prev.tasks || []), ...tasks],
          }));
          return true;
        }
        return false;
      } catch (err) {
        console.log("Error in handleAddToMyRoutine: ", err);
        return false;
      }
    },
    [type]
  );

  const accordionItems = useMemo(
    () =>
      routines?.map((routine) => {
        return (
          <AccordionRoutineRow
            key={routine._id}
            type={type as TypeEnum}
            routine={routine}
            isSelf={isSelf}
            handleReplaceRoutine={handleReplaceRoutine}
            openTaskDetails={openTaskDetails}
          />
        );
      }),
    [type, routines?.[0]?.type]
  );

  useEffect(() => {
    const payload: GetRoutinesProps = {
      followingUserId,
      routines,
      type,
    };
    getTrackedRoutines(payload);
  }, [type, followingUserId]);

  return (
    <ClubModerationLayout
      pageHeader={<ClubHeader title={"Club"} hideTypeDropdown={true} showReturn />}
      showChat
      showHeader
    >
      <Stack className={classes.container}>
        {routines ? (
          <>
            {routines.length > 0 ? (
              <Stack className={classes.wrapper}>
                <Accordion
                  value={openValue}
                  onChange={setOpenValue}
                  chevron={false}
                  className={classes.accordion}
                  classNames={{
                    content: classes.content,
                    chevron: classes.chevron,
                    label: classes.label,
                  }}
                >
                  {accordionItems}
                </Accordion>
                {hasMore && (
                  <ActionIcon
                    variant="default"
                    className={classes.getMoreButton}
                    onClick={() =>
                      getTrackedRoutines({
                        skip: true,
                        followingUserId,
                        routines,
                        type,
                      })
                    }
                  >
                    <IconArrowDown />
                  </ActionIcon>
                )}
              </Stack>
            ) : (
              <OverlayWithText
                icon={<IconCircleOff className="icon" />}
                text={`No ${type} routines`}
              />
            )}
          </>
        ) : (
          <Loader style={{ margin: "15vh auto 0" }} />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
