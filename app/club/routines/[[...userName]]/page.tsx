"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Loader, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import SelectDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import MoveTaskModalContent from "@/app/routines/MoveTaskModalContent";
import { GetRoutinesProps, HandleModifyTaskProps } from "@/app/routines/page";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { routineSortItems } from "@/data/sortItems";
import copyRoutine from "@/functions/copyRoutine";
import copyTask from "@/functions/copyTask";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchRoutines from "@/functions/fetchRoutines";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { getIsRoutineActive } from "@/helpers/utils";
import { RoutineType } from "@/types/global";
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

  const { name } = userDetails || {};

  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const isSelf = name === userName;

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
    const payload: GetRoutinesProps = {
      userName: userName,
      routinesLength: (routines && routines.length) || 0,
      sort,
      part,
      concern,
    };
    handleFetchRoutines(payload);
  }, [sort, part, concern, userName]);

  useEffect(() => {
    if (!userName) return;
    getFilters({
      collection: "routine",
      filter: [`userName=${userName}`],
      fields: ["part", "concerns"],
    }).then((result) => {
      const { part, concerns } = result;
      setAvailableParts(part);
      setAvailableConcerns(concerns);
    });
  }, [userName]);

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  const titles = clubPageTypeItems.map((item) => ({
    label: item.label,
    addQuery: true,
    value: `club/${item.value}/${userName}`,
  }));

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="routines"
          titles={titles}
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
      {accordionItems ? (
        <Stack className={classes.wrapper}>
          <Stack className={cn(classes.content, "scrollbar")}>
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
