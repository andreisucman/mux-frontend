"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, LoadingOverlay, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import { ChatCategoryEnum } from "@/app/diary/type";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import ChatWithModal from "@/components/ChatWithModal";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeaderClub from "@/components/PageHeaderClub";
import TaskInfoContainer from "@/components/TaskInfoContainer";
import { ClubContext } from "@/context/ClubDataContext";
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
import { AllTaskType, PurchaseOverlayDataType, RoutineType, UserDataType } from "@/types/global";
import RoutineSelectionButtons from "./RoutineSelectionButtons";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
  sort: string | null;
  part: string | null;
  routinesLength?: number;
};

type StealRoutinesProps = {
  routineIds: string[];
  startDate: Date | null;
  stealAll: boolean;
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
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>();
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<{ [key: string]: string[] }>({});
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  const { name, routines: currentUserRoutines, timeZone } = userDetails || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const isSelf = name === userName;

  const openTaskDetails = useCallback(
    (task: AllTaskType, routineId: string) => {
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
    },
    [currentUserRoutines]
  );

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, part, followingUserName, routinesLength }: GetRoutinesProps) => {
      const response = await fetchRoutines({
        skip,
        sort,
        part,
        followingUserName,
        routinesLength: routinesLength || 0,
      });

      const { message } = response;

      if (message) {
        const { priceData, data } = message;

        setPurchaseOverlayData(priceData ? priceData : null);
        setShowPurchaseOverlay(!!priceData);

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

  const handleStealTask = useCallback(
    async ({ taskKey, routineId, total, startDate }: StealTaskProps) => {
      if (!taskKey || !routineId || !startDate) return false;

      let isSuccess = false;

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
      return isSuccess;
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
            routine={routine}
            isSelf={isSelf}
            timeZone={timeZone}
            selectedRoutineIds={selectedRoutineIds}
            selectedConcerns={selectedConcerns}
            setSelectedConcerns={setSelectedConcerns}
            setRoutines={setRoutines}
            openTaskDetails={openTaskDetails}
            setSelectedRoutineIds={setSelectedRoutineIds}
          />
        );
      }),
    [routines, isSelf, timeZone, selectedConcerns, selectedRoutineIds]
  );

  useEffect(() => {
    const payload: GetRoutinesProps = {
      followingUserName: userName,
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
    };
    handleFetchRoutines(payload);
  }, [sort, part, userName, authStatus]);

  useEffect(() => {
    getFilters({
      userName,
      collection: "routine",
      fields: ["part"],
      filter: [`userName=${userName}`, "isPublic=true"],
    }).then((result) => {
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
          {showPurchaseOverlay && purchaseOverlayData && (
            <PurchaseOverlay purchaseOverlayData={purchaseOverlayData} userName={userName} />
          )}
          <RoutineSelectionButtons
            selectedRoutineIds={selectedRoutineIds}
            disabled={!routines || !routines.length}
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
                      followingUserName: userName,
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
            <OverlayWithText text={"Nothing found"} />
          )}
        </Stack>
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
    </ClubModerationLayout>
  );
}
