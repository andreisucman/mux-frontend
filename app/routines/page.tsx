"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import copyRoutine from "@/functions/copyRoutine";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import rescheduleRoutine from "@/functions/rescheduleRoutine";
import rescheduleTask from "@/functions/rescheduleTask";
import rescheduleTaskInstance from "@/functions/rescheduleTaskInstance";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { saveToIndexedDb } from "@/helpers/indexedDb";
import { getIsRoutineActive } from "@/helpers/utils";
import { RoutineType } from "@/types/global";
import SelectDateModalContent from "../explain/[taskId]/SelectDateModalContent";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateTaskOverlay from "../tasks/TasksList/CreateTaskOverlay";
import TasksButtons from "../tasks/TasksList/TasksButtons";
import MoveTaskModalContent from "./MoveTaskModalContent";
import classes from "./routines.module.css";

export const runtime = "edge";

export type GetRoutinesProps = {
  skip?: boolean;
  type?: string;
  sort: string | null;
  part: string | null;
  concern: string | null;
  userName?: string;
  routinesLength?: number;
};

export type HandleModifyTaskProps = {
  startDate: Date | null;
  selectedRoutineId?: string;
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
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>();
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);

  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  const concern = searchParams.get("concern");
  const part = searchParams.get("part");
  const sort = searchParams.get("sort");

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, concern, routinesLength }: GetRoutinesProps) => {
      const response = await fetchRoutines({
        skip,
        part,
        sort,
        concern,
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
      }
    },
    [routines]
  );

  const handleSetOpenValue = useCallback((part: string | null) => {
    saveToIndexedDb("openRoutinesRow", part);
    setOpenValue(part);
  }, []);

  const handleCopyRoutine = useCallback(
    (routineId: string) => {
      type HandleSubmitProps = { startDate: Date | null };

      const handleSubmit = ({ startDate }: HandleSubmitProps) => {
        modals.closeAll();
        copyRoutine({
          routineId,
          startDate,
          setRoutines,
        });
      };

      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        size: "sm",
        classNames: { overlay: "overlay" },
        innerProps: <SelectDateModalContent buttonText="Copy routine" onSubmit={handleSubmit} />,
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
  );

  const handleRescheduleRoutine = useCallback(
    (routineId: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        size: "sm",
        classNames: { overlay: "overlay" },
        innerProps: (
          <SelectDateModalContent
            buttonText={"Reschedule"}
            onSubmit={({ startDate }) =>
              rescheduleRoutine({
                routineId,
                startDate,
                sort,
                setRoutines,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
  );

  const updateRoutine = useCallback(async (routineId: string, newStatus: string) => {
    const response = await callTheServer({
      endpoint: "updateRoutineStatus",
      method: "POST",
      body: { routineId, newStatus },
    });

    if (response.status === 200) {
      setRoutines((prev) =>
        prev
          ?.filter(Boolean)
          .map((obj) =>
            routineId === obj._id
              ? response.message.find((r: RoutineType) => r._id === obj._id)
              : obj
          )
      );
    }
  }, []);

  const deleteRoutine = useCallback(
    async (routineId: string) => {
      const response = await callTheServer({
        endpoint: "deleteRoutines",
        method: "POST",
        body: { routineId },
      });

      if (response.status === 200) {
        setRoutines((prev) =>
          prev
            ?.filter(Boolean)
            .map((obj) =>
              routineId === obj._id
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
            Copy task
          </Title>
        ),
        size: "md",
        classNames: { overlay: "overlay" },
        innerProps: (
          <MoveTaskModalContent
            buttonText="Copy task"
            handleClick={async ({ startDate, selectedRoutineId }: HandleModifyTaskProps) =>
              copyTask({
                routineId,
                startDate,
                taskKey,
                sort,
                targetRoutineId: selectedRoutineId,
                setRoutines,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
  );

  const handleCopyTaskInstance = useCallback((taskId: string) => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Copy task instance
        </Title>
      ),
      size: "md",
      classNames: { overlay: "overlay" },
      innerProps: (
        <MoveTaskModalContent
          buttonText="Copy task"
          handleClick={async ({ startDate, selectedRoutineId }: HandleModifyTaskProps) =>
            copyTaskInstance({ setRoutines, targetRoutineId: selectedRoutineId, startDate, taskId })
          }
        />
      ),
      modal: "general",
      centered: true,
    });
  }, []);

  const handleRescheduleTask = useCallback(
    (routineId: string, taskKey: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Reschedule task
          </Title>
        ),
        size: "md",
        classNames: { overlay: "overlay" },
        innerProps: (
          <MoveTaskModalContent
            buttonText="Reschedule task"
            handleClick={async ({ startDate, selectedRoutineId }: HandleModifyTaskProps) =>
              rescheduleTask({
                currentRoutineId: routineId,
                targetRoutineId: selectedRoutineId,
                startDate,
                taskKey,
                sort,
                setRoutines,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
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

  const handleAddTaskInstance = useCallback(
    (taskId: string, lastDate: Date, selectedRoutineId: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Add another instance
          </Title>
        ),
        size: "sm",
        classNames: { overlay: "overlay" },
        innerProps: (
          <SelectDateModalContent
            buttonText="Copy task"
            lastDate={lastDate}
            onSubmit={async ({ startDate }: HandleModifyTaskProps) =>
              copyTaskInstance({
                setRoutines,
                targetRoutineId: selectedRoutineId,
                startDate,
                taskId,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    []
  );

  const handleRescheduleTaskInstance = useCallback(
    (taskId: string) => {
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Reschedule task instance
          </Title>
        ),
        size: "md",
        classNames: { overlay: "overlay" },
        innerProps: (
          <MoveTaskModalContent
            buttonText="Reschedule task"
            handleClick={async ({ startDate, selectedRoutineId }: HandleModifyTaskProps) =>
              rescheduleTaskInstance({
                sort,
                taskId,
                startDate,
                selectedRoutineId,
                setRoutines,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
  );

  const handleUpdateRoutine = (args: { routine: RoutineType }) => {
    const { routine } = args;

    const exists = routines?.some((r) => String(r._id) === String(routine._id));

    if (exists) {
      setRoutines((prev?: RoutineType[]) =>
        (prev || []).map((r) => (r._id === routine._id ? routine : r))
      );
    } else {
      setRoutines((prev?: RoutineType[]) => [...(prev || []), routine]);
    }
  };

  const accordionItems = useMemo(
    () =>
      routines
        ?.map((routine, i) => {
          if (!routine || routine.deletedOn) return null;
          const selected = getIsRoutineActive(routine.startsAt, routine.lastDate, routine.allTasks);
          return (
            <AccordionRoutineRow
              key={routine._id}
              index={i}
              routine={routine}
              selected={selected}
              setRoutines={setRoutines}
              deleteRoutine={deleteRoutine}
              updateRoutine={updateRoutine}
              copyRoutine={handleCopyRoutine}
              rescheduleRoutine={handleRescheduleRoutine}
              rescheduleTaskInstance={handleRescheduleTaskInstance}
              copyTask={handleCopyTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              rescheduleTask={handleRescheduleTask}
              copyTaskInstance={handleCopyTaskInstance}
              addTaskInstance={handleAddTaskInstance}
              isSelf
            />
          );
        })
        .filter(Boolean),
    [routines, handleCopyRoutine]
  );

  useEffect(() => {
    const payload: GetRoutinesProps = {
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
      concern,
    };
    handleFetchRoutines(payload);
  }, [sort, part, concern]);

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
    getFilters({
      collection: "routine",
      fields: ["part", "concerns"],
    }).then((result) => {
      const { part, concerns } = result;
      setAvailableParts(part);
      setAvailableConcerns(concerns);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: `routine`,
      setShowWaitComponent: (verdict?: boolean) => setIsAnalysisGoing(!!verdict),
    }).then((res) => {
      setPageLoaded(true);
    });
  }, [userId]);

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="My routines"
          disableFilter={!availableParts && !availableConcerns}
          disableSort={noPartsAndConcerns}
          filterNames={["part", "concern"]}
          defaultSortValue="-startsAt"
          sortItems={routineSortItems}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                partFilterItems: availableParts,
                concernFilterItems: availableConcerns,
              },
            })
          }
        />

        <TasksButtons
          disableCreateTask={displayComponent === "wait"}
          handleSaveTask={(props: HandleSaveTaskProps) =>
            saveTaskFromDescription({ ...props, returnRoutine: true, cb: handleUpdateRoutine })
          }
        />
        {displayComponent === "content" && (
          <Stack className={classes.wrapper}>
            <Accordion
              value={openValue}
              onChange={handleSetOpenValue}
              chevron={false}
              variant="separated"
              classNames={{
                root: "accordionRoot scrollbar",
                content: "accordionContent",
                chevron: "accordionChevron",
                item: "accordionItem",
                control: "accordionControl",
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
                    concern,
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
              saveTaskFromDescription({ ...props, returnRoutine: true, cb: handleUpdateRoutine })
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
                concern,
                sort,
                part,
              });
              setIsAnalysisGoing(false);
            }}
            customContainerStyles={{ paddingBottom: "20%" }}
          />
        )}
        {displayComponent === "loading" && (
          <Loader
            m="0 auto"
            pt="30%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
