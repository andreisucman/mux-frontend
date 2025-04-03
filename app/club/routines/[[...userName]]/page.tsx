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
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import copyRoutines from "@/functions/copyRoutines";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
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
  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const { userDetails, status: authStatus } = useContext(UserContext);
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [openValue, setOpenValue] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const { name, timeZone } = userDetails || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const isSelf = name === userName;

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
    [routines, selectedConcerns]
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
                ignoreIncompleteTasks: true,
                inform: true,
                sort,
                userName,
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
    [sort, userName, routines, selectedConcerns]
  );

  const handleCopyTaskInstance = useCallback(
    (taskId: string) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
              copyTaskInstance({ setRoutines, startDate, userName, taskId, timeZone, inform: true })
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
        return (
          <AccordionRoutineRow
            key={routine._id || i}
            index={i}
            routine={routine}
            isSelf={isSelf}
            timeZone={timeZone}
            selectedConcerns={selectedConcerns}
            setRoutines={setRoutines}
            setSelectedConcerns={setSelectedConcerns}
            copyRoutines={handleCopyRoutines}
            copyTaskInstance={handleCopyTaskInstance}
            copyTask={handleCopyTask}
          />
        );
      }),
    [routines, isSelf, timeZone, selectedConcerns, handleCopyRoutines]
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
