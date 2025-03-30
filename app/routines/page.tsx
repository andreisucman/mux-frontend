"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
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
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import openErrorModal from "@/helpers/openErrorModal";
import { RoutineType } from "@/types/global";
import SelectDateModalContent from "../explain/[taskId]/SelectDateModalContent";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateTaskOverlay from "../tasks/TasksList/CreateTaskOverlay";
import TasksButtons from "../tasks/TasksList/TasksButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

export type CloneOrRescheduleRoutinesProps = {
  routineIds: string[];
  startDate: Date | null;
  isReschedule?: boolean;
  sort?: string | null;
};

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
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);

  const { userDetails } = useContext(UserContext);
  const { _id: userId, timeZone, specialConsiderations } = userDetails || {};

  const part = searchParams.get("part");
  const sort = searchParams.get("sort");

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, routinesLength }: GetRoutinesProps) => {
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

        const newRoutineConcerns = data.reduce((a: { [key: string]: string[] }, c: RoutineType) => {
          a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
          return a;
        }, {});

        setSelectedConcerns((prev) => ({ ...prev, ...newRoutineConcerns }));
      }
    },
    [routines]
  );

  const handleSetOpenValue = useCallback((part: string | null) => {
    saveToIndexedDb("openRoutinesRow", part);
    setOpenValue(part);
  }, []);

  const cloneOrRescheduleRoutines = useCallback(
    async ({ routineIds, startDate, isReschedule, sort }: CloneOrRescheduleRoutinesProps) => {
      if (!startDate) return;

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const body: { [key: string]: any } = { routineIds, startDate, timeZone, sort };

      const response = await callTheServer({
        endpoint: isReschedule ? "rescheduleRoutines" : "cloneRoutines",
        method: "POST",
        body,
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error, onClose: () => modals.closeAll() });
          return;
        }

        if (isReschedule) {
          setRoutines((prev) => {
            const filtered = prev?.filter(Boolean) || [];
            return filtered?.map((obj) =>
              routineIds.includes(obj._id)
                ? response.message.find((r: RoutineType) => r._id === obj._id)
                : obj
            );
          });
        } else {
          const newRoutineConcerns = response.message.reduce(
            (a: { [key: string]: string[] }, c: RoutineType) => {
              a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
              return a;
            },
            {}
          );

          setSelectedConcerns((prev) => ({ ...prev, ...newRoutineConcerns }));
          setRoutines((prev) => {
            const updated = [...(prev || []), ...response.message];
            if (sort === "startsAt") {
              updated.sort(
                (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
              );
            } else {
              updated.sort(
                (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
              );
            }
            return updated;
          });
        }

        modals.closeAll();
      }
    },
    [sort]
  );

  const handleCloneOrRescheduleRoutines = useCallback(
    (routineIds: string[], isReschedule?: boolean) => {
      const buttonText = isReschedule ? "Reschedule" : "Clone";
      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        size: "sm",
        innerProps: (
          <SelectDateModalContent
            buttonText={buttonText}
            onSubmit={({ startDate }) =>
              cloneOrRescheduleRoutines({ routineIds, startDate, isReschedule, sort })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort]
  );

  const updateRoutineStatuses = useCallback(
    async (routineIds: string[], newStatus: string) => {
      const response = await callTheServer({
        endpoint: "updateRoutineStatuses",
        method: "POST",
        body: { timeZone, routineIds, newStatus },
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
    [timeZone]
  );

  const accordionItems = useMemo(
    () =>
      routines
        ?.map((routine, i) => {
          if (!routine) return null;
          return (
            <AccordionRoutineRow
              key={routine._id}
              index={i}
              routine={routine}
              timeZone={timeZone}
              selectedConcerns={selectedConcerns}
              updateRoutineStatuses={updateRoutineStatuses}
              setSelectedConcerns={setSelectedConcerns}
              cloneOrRescheduleRoutines={handleCloneOrRescheduleRoutines}
              setRoutines={setRoutines}
              isSelf
            />
          );
        })
        .filter(Boolean),
    [routines, timeZone, selectedConcerns, handleCloneOrRescheduleRoutines]
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
          isDisabled={availableParts.length === 0}
          filterNames={["part"]}
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
            timeZone={timeZone}
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
