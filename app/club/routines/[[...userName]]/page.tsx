"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Button, Loader, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ChatCategoryEnum } from "@/app/diary/type";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import OverlayWithText from "@/components/OverlayWithText";
import TaskInfoContainer from "@/components/TaskInfoContainer";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchRoutines from "@/functions/fetchRoutines";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { AllTaskType, RoutineType, TypeEnum, UserDataType } from "@/types/global";
import ChatWithModal from "../../../../components/ChatWithModal";
import ClubModerationLayout from "../../ModerationLayout";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
  type?: string;
  sort: string | null;
  routinesLength?: number;
};

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubRoutines(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();

  const { name, routines: currentUserRoutines } = userDetails || {};

  const type = searchParams.get("type") || "head";
  const sort = searchParams.get("sort") || "-createdAt";
  const isSelf = name === userName;

  const openTaskDetails = useCallback(
    (task: AllTaskType, routineId: string) => {
      try {
        const relevantRoutine = currentUserRoutines?.find((r) => r.type === type);
        const existingTasksKeys = relevantRoutine?.allTasks.map((t) => t.key);
        const existsInRoutines = existingTasksKeys?.includes(task.key) || false;

        modals.openContextModal({
          modal: "general",
          title: (
            <Title order={5} component="p">
              {task.name}
            </Title>
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
      } catch (err) {}
    },
    [type, currentUserRoutines?.length]
  );

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, followingUserName, routinesLength, type }: GetRoutinesProps) => {
      try {
        const data = await fetchRoutines({
          skip,
          sort,
          followingUserName,
          routinesLength: routinesLength || 0,
          type,
        });

        if (data) {
          if (skip) {
            setRoutines((prev) => [...(prev || []), ...data.slice(0, 20)]);
            setHasMore(data.length === 21);
          } else {
            setRoutines(data.slice(0, 20));
            if (!openValue) setOpenValue(data[0]?._id);
          }
        }
      } catch (err) {}
    },
    [routines]
  );

  const stealRoutine = useCallback(
    async (routineId: string) => {
      try {
        const response = await callTheServer({
          endpoint: "stealRoutine",
          method: "POST",
          body: { type, routineId },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            return;
          }

          const { routines, tasks } = response.message;
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            routines,
            tasks,
          }));
        }
      } catch (err) {}
    },
    [userDetails]
  );

  const handleAddToMyRoutine = useCallback(
    async (taskKey: string, routineId: string, total: number, startsAt: Date | null) => {
      if (!taskKey || !routineId || !startsAt || !type) return false;

      let isSuccess = false;
      try {
        const response = await callTheServer({
          endpoint: "stealTask",
          method: "POST",
          body: { taskKey, routineId, total, followingUserName: userName, type },
        });

        if (response.status === 200) {
          const { routine, tasks } = response.message;
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            routines: [...(prev.routines || []), routine],
            tasks: [...(prev.tasks || []), ...tasks],
          }));
          isSuccess = true;
        } else {
          openErrorModal();
        }
      } catch (err) {
      } finally {
        return isSuccess;
      }
    },
    [type, userDetails]
  );

  const accordionItems = useMemo(
    () =>
      routines
        ?.filter((routine) => routine.type === type)
        .map((routine) => {
          return (
            <AccordionRoutineRow
              key={routine._id}
              type={type as TypeEnum}
              routine={routine}
              isSelf={isSelf}
              handleStealRoutine={() =>
                askConfirmation({
                  title: "Steal routine",
                  body: "This will replace your current routine with the selected one. Are you sure?",
                  onConfirm: () => stealRoutine(routine._id),
                })
              }
              openTaskDetails={openTaskDetails}
            />
          );
        }),
    [type, routines, isSelf]
  );

  useEffect(() => {
    if (!type) return;
    const payload: GetRoutinesProps = {
      followingUserName: userName,
      routinesLength: (routines && routines.length) || 0,
      type,
      sort,
    };
    handleFetchRoutines(payload);
  }, [type, sort, userName]);

  return (
    <ClubModerationLayout pageType="routines" userName={userName} showChat showHeader>
      <Stack className={classes.container}>
        {accordionItems ? (
          <>
            {accordionItems.length > 0 ? (
              <Stack className={classes.wrapper}>
                <Accordion
                  value={openValue}
                  onChange={setOpenValue}
                  chevron={false}
                  className={`${classes.accordion} scrollbar`}
                  classNames={{
                    content: classes.content,
                    chevron: classes.chevron,
                    label: classes.label,
                    control: classes.control,
                  }}
                >
                  {accordionItems}
                </Accordion>
                {hasMore && (
                  <ActionIcon
                    variant="default"
                    className={classes.getMoreButton}
                    onClick={() =>
                      handleFetchRoutines({
                        skip: true,
                        followingUserName: userName,
                        routinesLength: (routines && routines.length) || 0,
                        sort,
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
                text={`No ${type} routines`}
                button={
                  <Button variant="default" mt={8} onClick={() => router.push("/tasks")}>
                    Create task
                  </Button>
                }
              />
            )}
          </>
        ) : (
          <Loader style={{ margin: "auto" }} />
        )}
        {routines && (
          <ChatWithModal
            chatCategory={ChatCategoryEnum.ROUTINE}
            openChatKey={ChatCategoryEnum.ROUTINE}
            defaultVisibility="open"
            dividerLabel={"Chat about routines and tasks"}
            modalTitle={
              <Title order={5} component={"p"}>
                Chat about routines and tasks
              </Title>
            }
          />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
