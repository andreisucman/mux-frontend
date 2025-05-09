"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import MoveTaskModalContent from "@/app/routines/MoveTaskModalContent";
import { GetRoutinesProps, HandleModifyTaskProps } from "@/app/routines/page";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import copyRoutine from "@/functions/copyRoutine";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { getIsRoutineActive } from "@/helpers/utils";
import { PurchaseOverlayDataType, RoutineType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import useGetAvailablePartsAndConcerns from "./useGetAvailablePartsAndConcerns";
import classes from "./routines.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubRoutines(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];
  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const { userDetails } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [openValue, setOpenValue] = useState<string | null>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const { name } = userDetails || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const isSelf = name === userName;

  const currentCombination = [part, concern].filter(Boolean).join("-");
  const isCurrentCombinationPurchased = !notPurchased.includes(currentCombination);

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, concern, part, userName, routinesLength }: GetRoutinesProps) => {
      const response = await fetchRoutines({
        skip,
        sort,
        part,
        concern,
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
      }
    },
    [routines]
  );

  const manageOverlays = useCallback(() => {
    if (!routines || routines.length === 0) {
      setShowOverlayComponent("none");
      return;
    }

    if (isCurrentCombinationPurchased) {
      if (notPurchased.length > 0) {
        setShowOverlayComponent("showOtherRoutinesButton");
      } else {
        setShowOverlayComponent("none");
      }
    } else if (notPurchased.length > 0) {
      setShowOverlayComponent("purchaseOverlay");
    }
  }, [isCurrentCombinationPurchased, notPurchased, routines]);

  const handleCloseOverlay = useCallback(() => {
    if (isCurrentCombinationPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [isCurrentCombinationPurchased]);

  const handleCopyRoutine = useCallback(
    (routineId: string) => {
      type HandleSubmitProps = { startDate: Date | null };

      const handleSubmit = ({ startDate }: HandleSubmitProps) => {
        modals.closeAll();
        copyRoutine({
          userName,
          routineId,
          startDate,
          inform: true,
          ignoreIncompleteTasks: true,
          setRoutines,
        });
      };

      modals.openContextModal({
        title: (
          <Title order={5} component={"p"}>
            Choose start date
          </Title>
        ),
        classNames: { overlay: "overlay" },
        innerProps: <SelectDateModalContent buttonText="Copy routine" onSubmit={handleSubmit} />,
        modal: "general",
        centered: true,
      });
    },
    [sort, routines]
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
                userName,
                sort,
                targetRoutineId: selectedRoutineId,
                inform: true,
                setRoutines,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [sort, userName, routines]
  );

  const handleCopyTaskInstance = useCallback(
    (taskId: string) => {
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
              copyTaskInstance({
                setRoutines,
                userName,
                targetRoutineId: selectedRoutineId,
                startDate,
                taskId,
                inform: true,
                returnTask: true,
              })
            }
          />
        ),
        modal: "general",
        centered: true,
      });
    },
    [userName]
  );

  const accordionItems = useMemo(
    () =>
      routines?.map((routine, i) => {
        const selected = getIsRoutineActive(routine.startsAt, routine.lastDate, routine.allTasks);
        return (
          <AccordionRoutineRow
            key={routine._id || i}
            index={i}
            routine={routine}
            selected={selected}
            isSelf={isSelf}
            copyTaskInstance={handleCopyTaskInstance}
            copyRoutine={handleCopyRoutine}
            copyTask={handleCopyTask}
            setRoutines={setRoutines}
          />
        );
      }),
    [routines, isSelf, handleCopyRoutine]
  );

  useEffect(() => {
    manageOverlays();
  }, [isCurrentCombinationPurchased, notPurchased, routines]);

  useEffect(() => {
    const payload: GetRoutinesProps = {
      userName: userName,
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
      concern,
    };
    handleFetchRoutines(payload);
  }, [sort, part, concern, userName]);

  useGetAvailablePartsAndConcerns({
    purchaseOverlayData,
    setConcerns: setAvailableConcerns,
    setParts: setAvailableParts,
    userName,
  });

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    routines &&
    routines.length > 0;

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="routines"
          title={"Club"}
          userName={userName}
          filterNames={["part", "concern"]}
          defaultSortValue="-startsAt"
          sortItems={routineSortItems}
          disableFilter={!availableConcerns && !availableParts}
          disableSort={noPartsAndConcerns}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                concernFilterItems: availableConcerns,
                partFilterItems: availableParts,
                userName,
              },
            })
          }
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <MaximizeOverlayButton
        isDisabled={!showButton}
        showOverlayComponent={showOverlayComponent}
        notPurchased={notPurchased}
        setShowOverlayComponent={setShowOverlayComponent}
      />
      {accordionItems ? (
        <Stack className={classes.wrapper}>
          <Stack
            className={cn(classes.content, "scrollbar", {
              [classes.unbound]: showOverlayComponent !== "purchaseOverlay",
            })}
          >
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
              </>
            )}
            {accordionItems.length > 0 ? (
              <>
                <Accordion
                  value={openValue}
                  onChange={setOpenValue}
                  chevron={false}
                  variant="separated"
                  classNames={{
                    root: "accordionRoot scrollbar",
                    content: "accordionContent",
                    chevron: "accordionChevron",
                    item: "accordionItem",
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
                        concern,
                        part,
                        sort,
                      })
                    }
                  >
                    <IconArrowDown />
                  </ActionIcon>
                )}
              </>
            ) : (
              <OverlayWithText text={"Nothing found"} icon={<IconCircleOff className="icon" />} />
            )}
          </Stack>
        </Stack>
      ) : (
        <Loader
          m="0 auto"
          pt="30%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
    </ClubModerationLayout>
  );
}
