"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Loader, LoadingOverlay, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeaderClub from "@/components/PageHeaderClub";
import TaskInfoContainer from "@/components/TaskInfoContainer";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import cloneRoutines from "@/functions/cloneRoutines";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { useRouter } from "@/helpers/custom-router";
import { AllTaskType, PurchaseOverlayDataType, RoutineType, UserDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import RoutineSelectionButtons from "./RoutineSelectionButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  userName?: string | string[];
  sort: string | null;
  part: string | null;
  routinesLength?: number;
};

type StealTaskProps = {
  taskKey: string;
  routineId: string;
  total: number;
  startDate: Date | null;
};

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubRoutines(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const { userDetails, setUserDetails, status: authStatus } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const { name, tasks, timeZone } = userDetails || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const isSelf = name === userName;

  const openTaskDetails = useCallback(
    (task: AllTaskType, routineId: string) => {
      const existingTasksKeys = (tasks || []).map((t) => t.key);
      const alreadyExist = existingTasksKeys.includes(task.key);

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
            alreadyExists={alreadyExist}
          />
        ),
      });
    },
    [tasks]
  );

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, userName, routinesLength }: GetRoutinesProps) => {
      const response = await fetchRoutines({
        skip,
        sort,
        part,
        userName,
        routinesLength: routinesLength || 0,
      });

      const { message } = response || {};

      if (message) {
        const { priceData, data, notPurchased } = message;

        setPurchaseOverlayData(priceData ? priceData : null);
        setNotPurchased(notPurchased);

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
    [routines, selectedRoutineIds]
  );

  const handleStealTask = useCallback(
    async ({ taskKey, routineId, total, startDate }: StealTaskProps) => {
      if (!taskKey || !routineId || !startDate) return false;

      let isSuccess = false;

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await callTheServer({
        endpoint: "stealTask",
        method: "POST",
        body: { taskKey, routineId, startDate, total, userName, timeZone },
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          tasks: [...(prev.tasks || []), ...response.message],
        }));
        isSuccess = true;
      }
      return isSuccess;
    },
    [userDetails]
  );

  const handleStealRoutines = (routineIds: string[], copyAll: boolean) => {
    type HandleSubmitProps = { startDate: Date | null };

    const handleSubmit = ({ startDate }: HandleSubmitProps) => {
      modals.closeAll();
      cloneRoutines({ routineIds, startDate, copyAll, router, setIsLoading, userName });
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

  const manageOverlays = useCallback(() => {
    const isCurrentPartPurchased = part && !notPurchased.includes(part);

    if (isCurrentPartPurchased) {
      if (notPurchased.length > 0) {
        setShowOverlayComponent("showOtherRoutinesButton");
      } else {
        setShowOverlayComponent("none");
      }
    } else if (notPurchased.length > 0) {
      setShowOverlayComponent("purchaseOverlay");
    }
  }, [part, notPurchased]);

  const handleCloseOverlay = useCallback(() => {
    const isCurrentPartPurchased = part && !notPurchased.includes(part);
    if (isCurrentPartPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [part, notPurchased]);

  const deleteRoutines = useCallback(
    async (routineIds: string[]) => {
      const response = await callTheServer({
        endpoint: "deleteRoutines",
        method: "POST",
        body: { timeZone, routineIds },
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
      routines?.map((routine, i) => {
        return (
          <AccordionRoutineRow
            key={routine._id || i}
            index={i}
            routine={routine}
            isSelf={isSelf}
            timeZone={timeZone}
            selectedRoutineIds={selectedRoutineIds}
            selectedConcerns={selectedConcerns}
            setRoutines={setRoutines}
            deleteRoutines={deleteRoutines}
            openTaskDetails={openTaskDetails}
            setSelectedConcerns={setSelectedConcerns}
            setSelectedRoutineIds={setSelectedRoutineIds}
          />
        );
      }),
    [routines, isSelf, timeZone, selectedConcerns, selectedRoutineIds]
  );

  useEffect(() => {
    manageOverlays();
  }, [part, notPurchased]);

  useEffect(() => {
    const payload: GetRoutinesProps = {
      userName: userName,
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
    };
    handleFetchRoutines(payload);
  }, [sort, part, userName, authStatus]);

  useEffect(() => {
    if (!userName) return;
    getFilters({
      userName,
      collection: "routine",
      fields: ["part"],
      filter: [`userName=${userName}`],
    }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, [userName]);

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="routines"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          defaultSortValue="-startsAt"
          sortItems={routineSortItems}
          isDisabled={!availableParts}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                filterItems: availableParts,
                userName,
              },
            })
          }
        />
      }
    >
      <LoadingOverlay
        visible={isLoading}
        style={{ position: "fixed", inset: 0, borderRadius: "1rem" }}
      />
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      {accordionItems ? (
        <Stack className={classes.wrapper}>
          <Stack className={cn(classes.content, "scrollbar")}>
            {purchaseOverlayData && (
              <>
                {showOverlayComponent === "purchaseOverlay" && (
                  <PurchaseOverlay
                    userName={userName}
                    notPurchasedParts={notPurchased}
                    purchaseOverlayData={purchaseOverlayData}
                    handleCloseOverlay={handleCloseOverlay}
                  />
                )}
                {["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) && (
                  <MaximizeOverlayButton
                    showOverlayComponent={showOverlayComponent}
                    notPurchased={notPurchased}
                    setShowOverlayComponent={setShowOverlayComponent}
                  />
                )}
              </>
            )}
            <RoutineSelectionButtons
              allRoutineIds={routines?.map((r) => r._id) || []}
              selectedRoutineIds={selectedRoutineIds}
              disabled={!routines || !routines.length || !routines?.[0]?._id}
              handleClick={handleStealRoutines}
              isSelf={isSelf}
            />
            {accordionItems.length > 0 ? (
              <Stack className={classes.content}>
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
                        userName: userName,
                        routinesLength: (routines && routines.length) || 0,
                        part,
                        sort,
                      })
                    }
                  >
                    <IconArrowDown />
                  </ActionIcon>
                )}
              </Stack>
            ) : (
              <OverlayWithText text={"Nothing found"} icon={<IconCircleOff className="icon" />} />
            )}
          </Stack>
        </Stack>
      ) : (
        <Loader style={{ margin: "auto" }} />
      )}
    </ClubModerationLayout>
  );
}
