"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import {
  Accordion,
  ActionIcon,
  Button,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { ChatCategoryEnum } from "@/app/diary/type";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import ChatWithModal from "@/components/ChatWithModal";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeaderClub from "@/components/PageHeaderClub";
import TaskInfoContainer from "@/components/TaskInfoContainer";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { AllTaskType, RoutineType, UserDataType } from "@/types/global";
import ClubModerationLayout from "../../ModerationLayout";
import RoutineSelectionButtons from "./RoutineSelectionButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});

  const { name, routines: currentUserRoutines, club, timeZone } = userDetails || {};
  const { followingUserName } = club || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const isSelf = name === userName;

  const openTaskDetails = useCallback(
    (task: AllTaskType, routineId: string) => {
      try {
        const relevantRoutine = currentUserRoutines?.find((r) => r._id === routineId);
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
                handleStealTask({
                  taskKey: task.key,
                  routineId,
                  total,
                  startDate: startsAt,
                })
              }
              alreadyExists={existsInRoutines}
            />
          ),
        });
      } catch (err) {
        console.log("Error: ", err);
      }
    },
    [currentUserRoutines]
  );

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, followingUserName, routinesLength }: GetRoutinesProps) => {
      try {
        const response = await fetchRoutines({
          skip,
          sort,
          part,
          followingUserName,
          routinesLength: routinesLength || 0,
        });

        const { message } = response;

        if (message) {
          if (skip) {
            setRoutines((prev) => [...(prev || []), ...message.slice(0, 20)]);
            setHasMore(message.length === 21);
          } else {
            setRoutines(message.slice(0, 20));
            if (!openValue) setOpenValue(message[0]?._id);
          }
        }
      } catch (err) {}
    },
    [routines, selectedRoutineIds]
  );

  type StealRoutinesProps = {
    routineIds: string[];
    startDate: Date | null;
    stealAll: boolean;
  };

  const stealRoutines = async ({ routineIds, startDate, stealAll }: StealRoutinesProps) => {
    setIsLoading(true);

    const body: { [key: string]: any } = { routineIds, userName, startDate };

    if (stealAll) {
      body.stealAll = stealAll;
    } else {
      body.routineIds = routineIds;
    }

    const response = await callTheServer({
      endpoint: "stealRoutine",
      method: "POST",
      body,
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        setIsLoading(false);
        return;
      }

      openInfoModal({
        title: "✔️ Success!",
        description: (
          <Text>
            Routine added.{" "}
            <span
              onClick={() => {
                router.push("/routines");
                modals.closeAll();
              }}
            >
              Click to view.
            </span>
          </Text>
        ),
      });
      setIsLoading(false);
    }
  };

  type StealTaskProps = {
    taskKey: string;
    routineId: string;
    total: number;
    startDate: Date | null;
  };

  const handleStealTask = useCallback(
    async ({ taskKey, routineId, total, startDate }: StealTaskProps) => {
      if (!taskKey || !routineId || !startDate) return false;

      let isSuccess = false;
      try {
        const response = await callTheServer({
          endpoint: "stealTask",
          method: "POST",
          body: { taskKey, routineId, startDate, total, followingUserName: userName },
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
    [userDetails]
  );

  const handleStealRoutines = (routineIds: string[], stealAll: boolean) => {
    type HandleSubmitProps = { startDate: Date | null };

    const handleSubmit =
      currentUserRoutines && currentUserRoutines.length
        ? ({ startDate }: HandleSubmitProps) =>
            askConfirmation({
              title: "Steal routine",
              body: "This will replace your current routine. Continue?",
              onConfirm: () => {
                modals.closeAll();
                stealRoutines({ routineIds, startDate, stealAll });
              },
            })
        : ({ startDate }: HandleSubmitProps) => {
            modals.closeAll();
            stealRoutines({ routineIds, startDate, stealAll });
          };

    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose start date
        </Title>
      ),
      size: "sm",
      innerProps: <SelectDateModalContent buttonText="Steal routine" onSubmit={handleSubmit} />,
      modal: "general",
      centered: true,
    });
  };

  const accordionItems = useMemo(
    () =>
      routines?.map((routine, i) => {
        return (
          <AccordionRoutineRow
            key={routine._id}
            zIndex={routines.length - i}
            routine={routine}
            isSelf={isSelf}
            timeZone={timeZone}
            selectedConcerns={selectedConcerns}
            selectedRoutineIds={selectedRoutineIds}
            setRoutines={setRoutines}
            openTaskDetails={openTaskDetails}
            setSelectedConcerns={setSelectedConcerns}
            setSelectedRoutineIds={setSelectedRoutineIds}
          />
        );
      }),
    [routines, isSelf, timeZone, selectedRoutineIds]
  );

  useEffect(() => {
    const payload: GetRoutinesProps = {
      followingUserName: userName,
      routinesLength: (routines && routines.length) || 0,
      sort,
    };
    handleFetchRoutines(payload);
  }, [sort, userName, followingUserName]);

  useEffect(() => {
    getFilters({ userName, collection: "routine", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, []);

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="routines"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          sortItems={routineSortItems}
          isDisabled={availableParts.length === 0}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                filterItems: availableParts,
                userName,
              },
            })
          }
          showReturn
        />
      }
      userName={userName}
      showChat
      showHeader
    >
      <LoadingOverlay
        visible={isLoading}
        style={{ position: "fixed", inset: 0, borderRadius: "1rem" }}
      />

      <Stack className={classes.container}>
        <RoutineSelectionButtons
          selectedRoutineIds={selectedRoutineIds}
          disabled={!routines || !routines.length}
          handleClick={handleStealRoutines}
          isSelf={isSelf}
        />
        {accordionItems ? (
          <>
            {accordionItems.length > 0 ? (
              <Stack className={classes.wrapper}>
                <Accordion
                  value={openValue}
                  onChange={setOpenValue}
                  chevron={false}
                  variant="separated"
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
                      })
                    }
                  >
                    <IconArrowDown />
                  </ActionIcon>
                )}
              </Stack>
            ) : (
              <OverlayWithText
                text={"Nothing found"}
                button={
                  isSelf && (
                    <Button variant="default" mt={8} onClick={() => router.push("/routines")}>
                      Create task
                    </Button>
                  )
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
            dividerLabel={"Chat about routines and tasks"}
            modalTitle={
              <Title order={5} component={"p"}>
                Chat about routines and tasks
              </Title>
            }
            isClub={!isSelf}
          />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
