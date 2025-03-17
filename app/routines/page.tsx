"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import ChatWithModal from "@/components/ChatWithModal";
import { ConsiderationsInput } from "@/components/ConsiderationsInput";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import { RoutineType } from "@/types/global";
import { ChatCategoryEnum } from "../diary/type";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateTaskOverlay from "../tasks/TasksList/CreateTaskOverlay";
import TasksButtons from "../tasks/TasksList/TasksButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
  type?: string;
  sort: string | null;
  part: string | null;
  routinesLength?: number;
};

export default function ClubRoutines() {
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

  const { userDetails } = useContext(UserContext);
  const { timeZone, specialConsiderations } = userDetails || {};

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

      const { message } = response;

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
    },
    [routines]
  );

  const handleSetOpenValue = useCallback((part: string | null) => {
    saveToIndexedDb("openRoutinesRow", part);
    setOpenValue(part);
  }, []);

  const accordionItems = useMemo(
    () =>
      routines?.map((routine, i) => {
        return (
          <AccordionRoutineRow
            key={routine._id}
            routine={routine}
            timeZone={timeZone}
            selectedConcerns={selectedConcerns}
            setSelectedConcerns={setSelectedConcerns}
            setRoutines={setRoutines}
            isSelf
          />
        );
      }),
    [routines, timeZone, selectedConcerns]
  );

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.routine;

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
    const routinesExist = routines && routines.length > 0;

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

  useEffect(() => setPageLoaded(true), []);

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
            saveTaskFromDescription({ ...props, setDisplayComponent })
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
              saveTaskFromDescription({ ...props, setDisplayComponent })
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
              setDisplayComponent("content");
            }}
            onError={() => {
              setDisplayComponent("loading");
              deleteFromLocalStorage("runningAnalyses", "routine");
            }}
            customContainerStyles={{ margin: "unset", paddingTop: "15%" }}
          />
        )}
        {displayComponent === "loading" && <Loader style={{ margin: "auto" }} />}
        {routines && (
          <ChatWithModal
            defaultVisibility="open"
            chatCategory={ChatCategoryEnum.ROUTINE}
            openChatKey={ChatCategoryEnum.ROUTINE}
            dividerLabel={"Chat about routine and tasks"}
            modalTitle={
              <Title order={5} component={"p"}>
                Chat about routines and tasks
              </Title>
            }
            customStyles={{ marginTop: "auto" }}
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
