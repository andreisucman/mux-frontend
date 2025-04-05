"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, LoadingOverlay, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { ConsiderationsInput } from "@/components/ConsiderationsInput";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import copyRoutines from "@/functions/copyRoutines";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import rescheduleRoutines from "@/functions/rescheduleRoutines";
import rescheduleTask from "@/functions/rescheduleTask";
import rescheduleTaskInstance from "@/functions/rescheduleTaskInstance";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { getIsRoutineActive } from "@/helpers/utils";
import { RoutineType } from "@/types/global";
import SelectDateModalContent from "../explain/[taskId]/SelectDateModalContent";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateTaskOverlay from "../tasks/TasksList/CreateTaskOverlay";
import TasksButtons from "../tasks/TasksList/TasksButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  type?: string;
  sort: string | null;
  part: string | null;
  routinesLength?: number;
};

export default function MyRoutines() {
  const searchParams = useSearchParams();
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "createTaskOverlay" | "content"
  >("loading");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>();
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);

  const { userDetails } = useContext(UserContext);
  const { _id: userId, specialConsiderations } = userDetails || {};

  const part = searchParams.get("part");
  const sort = searchParams.get("sort");

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, routinesLength }: GetRoutinesProps) => {
      try {
        const response = await fetchRoutines({
          skip,
          part,
          sort,
          routinesLength: routinesLength || 0,
        });

        const { message } = response || {};

        if (message) {
          const { data } = message;
          if (skip) {
            setRoutines((prev) => [...(prev || []), ...data.slice(0, 20)]);
            setHasMore(data.length === 21);
          } else {
            setRoutines(data.slice(0, 20));
          }

          const newRoutineConcerns = data.reduce(
            (a: { [key: string]: string[] }, c: RoutineType) => {
              a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
              return a;
            },
            {}
          );

          setSelectedConcerns((prev) => ({ ...prev, ...newRoutineConcerns }));
        }
      } catch (err) {}
    },
    [routines, selectedConcerns]
  );

  const handleSetOpenValue = useCallback((part: string | null) => {
    saveToIndexedDb("openRoutinesRow", part);
    setOpenValue(part);
  }, []);

  const handleCopyRoutines = useCallback(
    (routineIds: string[]) => {
      type HandleSubmitProps = { startDate: Date | null };

      const handleSubmit = ({ startDate }: HandleSubmitProps) => {
        modals.closeAll();
        copyRoutines({
          routineIds,
          startDate,
          setRoutines,
          setIsLoading,
          setSelectedConcerns,
        });
      };

      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        size: "sm",
        innerProps: <SelectDateModalContent buttonText="Copy routine" onSubmit={handleSubmit} />,
        modal: "general",
        centered: true,
      });
    },
    [sort, selectedConcerns, routines]
  );

  const handleRescheduleRoutines = useCallback(
    (routineIds: string[]) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        size: "sm",
        innerProps: (
          <SelectDateModalContent
            buttonText={"Reschedule"}
            onSubmit={({ startDate }) =>
              rescheduleRoutines({
                routineIds,
                startDate,
                sort,
                setIsLoading,
                setRoutines,
                setSelectedConcerns,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, selectedConcerns, routines]
  );

  const updateRoutines = useCallback(async (routineIds: string[], newStatus: string) => {
    const response = await callTheServer({
      endpoint: "updateROutineStatuses",
      method: "POST",
      body: { routineIds, newStatus },
    });

    if (response.status === 200) {
      setRoutines((prev) =>
        prev
          ?.filter(Boolean)
          .map((obj) =>
            routineIds.includes(obj._id)
              ? response.message.find((r: RoutineType) => r._id === obj._id)
              : obj
          )
      );
    }
  }, []);

  const deleteRoutines = useCallback(
    async (routineIds: string[]) => {
      const response = await callTheServer({
        endpoint: "deleteRoutines",
        method: "POST",
        body: { routineIds },
      });

      if (response.status === 200) {
        setRoutines((prev) =>
          prev
            ?.filter(Boolean)
            .map((obj) =>
              routineIds.includes(obj._id)
                ? response.message.find((r: RoutineType) => r._id === obj._id)
                : obj
            )
        );
      }
    },
    [routines]
  );

  const handleCopyTask = useCallback(
    (routineId: string, taskKey: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose new date
          </Title>
        ),
        size: "sm",
        innerProps: (
          <SelectDateModalContent
            buttonText="Copy task"
            onSubmit={async ({ startDate }) =>
              copyTask({
                routineId,
                startDate,
                taskKey,
                sort,
                setRoutines,
                setIsLoading,
                setSelectedConcerns,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines, selectedConcerns]
  );

  const handleRescheduleTask = useCallback(
    (routineId: string, taskKey: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose new date
          </Title>
        ),
        size: "sm",
        innerProps: (
          <SelectDateModalContent
            buttonText="Reschedule task"
            onSubmit={async ({ startDate }) =>
              rescheduleTask({
                routineId,
                startDate,
                taskKey,
                sort,
                setRoutines,
                setIsLoading,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines, selectedConcerns]
  );

  const deleteTask = useCallback(
    async (routineId: string, taskKey: string) => {
      const response = await callTheServer({
        endpoint: "deleteTask",
        method: "POST",
        body: { routineId, taskKey },
      });

      if (response.status === 200) {
        const routine = response.message;
        setRoutines((prev) =>
          prev?.filter(Boolean).map((obj) => (obj._id === routine._id ? routine : obj))
        );
      }
    },
    [routines]
  );

  const updateTask = useCallback(
    async (routineId: string, taskKey: string, newStatus: string) => {
      const response = await callTheServer({
        endpoint: "updateStatusOfTask",
        method: "POST",
        body: { routineId, taskKey, newStatus },
      });

      if (response.status === 200) {
        const routine = response.message;
        if (routine)
          setRoutines((prev) =>
            prev?.filter(Boolean).map((obj) => (obj._id === routine._id ? routine : obj))
          );
      }
    },
    [routines]
  );

  const handleCopyTaskInstance = useCallback((taskId: string) => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose new date
        </Title>
      ),
      size: "sm",
      innerProps: (
        <SelectDateModalContent
          buttonText="Copy task"
          onSubmit={async ({ startDate }) => copyTaskInstance({ setRoutines, startDate, taskId })}
        />
      ),
      modal: "general",
      centered: true,
    });
  }, []);

  const handleRescheduleTaskInstance = useCallback(
    (taskId: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose new date
          </Title>
        ),
        size: "sm",
        innerProps: (
          <SelectDateModalContent
            buttonText="Reschedule task"
            onSubmit={async ({ startDate }) =>
              rescheduleTaskInstance({
                startDate,
                taskId,
                sort,
                setRoutines,
                setIsLoading,
                setSelectedConcerns,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines, selectedConcerns]
  );

  const accordionItems = useMemo(
    () =>
      routines
        ?.map((routine, i) => {
          if (!routine) return null;
          const selected = getIsRoutineActive(routine.startsAt, routine.lastDate, routine.allTasks);
          return (
            <AccordionRoutineRow
              key={routine._id}
              index={i}
              routine={routine}
              selected={selected}
              selectedConcerns={selectedConcerns}
              setRoutines={setRoutines}
              deleteRoutines={deleteRoutines}
              updateRoutines={updateRoutines}
              setSelectedConcerns={setSelectedConcerns}
              copyRoutines={handleCopyRoutines}
              rescheduleRoutines={handleRescheduleRoutines}
              rescheduleTaskInstance={handleRescheduleTaskInstance}
              copyTask={handleCopyTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              rescheduleTask={handleRescheduleTask}
              copyTaskInstance={handleCopyTaskInstance}
              isSelf
            />
          );
        })
        .filter(Boolean),
    [routines, selectedConcerns, handleCopyRoutines]
  );

  useEffect(() => {
    const payload: GetRoutinesProps = {
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
    };
    handleFetchRoutines(payload);
  }, [sort, part]);

  useEffect(() => {
    if (!routines || !pageLoaded) return;
    const routinesExist = routines && routines.filter(Boolean).length > 0;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (!routinesExist) {
      setDisplayComponent("createTaskOverlay");
    } else if (routinesExist) {
      setDisplayComponent("content");
    } else if (routines === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, routines, pageLoaded]);

  useEffect(() => {
    getFilters({ collection: "routine", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });

    getFromIndexedDb("openRoutinesRow").then((part) => {
      setOpenValue(part);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: `routine`,
      setShowWaitComponent: setIsAnalysisGoing,
    }).then((res) => {
      setPageLoaded(true);
    });
  }, [userId]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="My routines"
          isDisabled={!availableParts}
          filterNames={["part"]}
          defaultSortValue="-startsAt"
          sortItems={routineSortItems}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                filterItems: availableParts,
              },
            })
          }
        />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          maxLength={300}
        />
        <TasksButtons
          disableCreateTask={displayComponent === "wait"}
          handleSaveTask={(props: HandleSaveTaskProps) =>
            saveTaskFromDescription({ ...props, setIsAnalysisGoing })
          }
        />
        {displayComponent === "content" && (
          <Stack className={classes.wrapper}>
            <LoadingOverlay
              visible={isLoading}
              style={{ position: "fixed", inset: 0, borderRadius: "1rem" }}
            />
            <Accordion
              value={openValue}
              onChange={handleSetOpenValue}
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
                    routinesLength: (routines && routines.length) || 0,
                    sort,
                    part,
                  })
                }
              >
                <IconArrowDown />
              </ActionIcon>
            )}
          </Stack>
        )}
        {displayComponent === "empty" && <OverlayWithText text="Nothing found" />}
        {displayComponent === "createTaskOverlay" && (
          <CreateTaskOverlay
            handleSaveTask={(props: HandleSaveTaskProps) =>
              saveTaskFromDescription({ ...props, setIsAnalysisGoing })
            }
          />
        )}
        {displayComponent === "wait" && (
          <WaitComponent
            operationKey={"routine"}
            description="Creating your task(s)"
            onComplete={() => {
              handleFetchRoutines({
                routinesLength: (routines && routines.length) || 0,
                sort,
                part,
              });
              setIsAnalysisGoing(false);
            }}
            onError={() => {
              setIsAnalysisGoing(false);
            }}
            customContainerStyles={{ margin: "unset", paddingTop: "15%" }}
          />
        )}
        {displayComponent === "loading" && <Loader style={{ margin: "auto" }} />}
      </SkeletonWrapper>
    </Stack>
  );
}
