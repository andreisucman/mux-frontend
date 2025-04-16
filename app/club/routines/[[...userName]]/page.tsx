"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import MoveTaskModalContent from "@/app/routines/MoveTaskModalContent";
import { HandleModifyTaskProps } from "@/app/routines/page";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import copyRoutines from "@/functions/copyRoutines";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { useRouter } from "@/helpers/custom-router";
import { getIsRoutineActive } from "@/helpers/utils";
import { PurchaseOverlayDataType, RoutineType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  userName?: string | string[];
  sort: string | null;
  part: string | null;
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
  const { publicUserData } = useContext(ClubContext);
  const { userDetails, status: authStatus } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [openValue, setOpenValue] = useState<string | null>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
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
  const isSelf = name === userName;

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, userName, routinesLength }: GetRoutinesProps) => {
      try {
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
        }
      } catch (err) {}
    },
    [routines]
  );

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

  const handleCopyRoutines = useCallback(
    (routineIds: string[]) => {
      type HandleSubmitProps = { startDate: Date | null };

      const handleSubmit = ({ startDate }: HandleSubmitProps) => {
        modals.closeAll();
        copyRoutines({
          userName,
          routineIds,
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
        size: "sm",
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
            copyRoutines={handleCopyRoutines}
            copyTask={handleCopyTask}
            setRoutines={setRoutines}
          />
        );
      }),
    [routines, isSelf, handleCopyRoutines]
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
    if (!purchaseOverlayData || !userName) return;
    const availableConcerns = purchaseOverlayData.map((obj) => obj.concern);
    setAvailableConcerns(availableConcerns.map((c) => ({ value: c, label: upperFirst(c) })));
  }, [userName, purchaseOverlayData]);

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    routines &&
    routines.length > 0;

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
          isDisabled={!availableConcerns}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.RoutinesFilterCardContent,
              childrenProps: {
                filterItems: availableConcerns,
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
              </>
            )}
            {accordionItems.length > 0 ? (
              <Stack className={classes.content}>
                <Accordion
                  value={openValue}
                  onChange={setOpenValue}
                  chevron={false}
                  variant="separated"
                  className={`${classes.accordion} scrollbar`}
                  classNames={{
                    content: classes.routineContent,
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
                {showButton && (
                  <MaximizeOverlayButton
                    showOverlayComponent={showOverlayComponent}
                    notPurchased={notPurchased}
                    setShowOverlayComponent={setShowOverlayComponent}
                  />
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
