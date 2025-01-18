"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { Accordion, ActionIcon, Loader, Stack } from "@mantine/core";
import AccordionRoutineRow from "@/components/AccordionRoutineRow";
import OverlayWithText from "@/components/OverlayWithText";
import fetchRoutines from "@/functions/fetchRoutines";
import { RoutineType, TypeEnum } from "@/types/global";
import classes from "./routines.module.css";

export const runtime = "edge";

type GetRoutinesProps = {
  skip?: boolean;
  followingUserName?: string | string[];
  type?: string;
  sort: string | null;
  routinesLength?: number;
};

export default function ClubRoutines() {
  const searchParams = useSearchParams();
  const [routines, setRoutines] = useState<RoutineType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [openValue, setOpenValue] = useState<string | null>();

  const type = searchParams.get("type") || "head";
  const sort = searchParams.get("sort") || "-createdAt";

  const handleFetchRoutines = useCallback(
    async ({ skip, sort, routinesLength, type }: GetRoutinesProps) => {
      try {
        const data = await fetchRoutines({
          skip,
          sort,
          routinesLength: routinesLength || 0,
          type,
        });

        setRoutines((prev) => [...(prev || []), ...data.slice(0, 20)]);
        setHasMore(data.length === 21);

        if (!openValue) setOpenValue(data[0]?._id);
      } catch (err) {}
    },
    [routines]
  );

  const accordionItems = useMemo(
    () =>
      routines
        ?.filter((routine) => routine.type === type)
        .map((routine) => {
          return (
            <AccordionRoutineRow
              key={routine._id}
              type={type as TypeEnum}
              routine={routine}
              isSelf={true}
            />
          );
        }),
    [type, routines]
  );

  useEffect(() => {
    if (!type) return;
    const payload: GetRoutinesProps = {
      routinesLength: (routines && routines.length) || 0,
      type,
      sort,
    };
    handleFetchRoutines(payload);
  }, [type, sort]);

  return (
    <Stack className={classes.container}>
      {accordionItems ? (
        <>
          {accordionItems.length > 0 ? (
            <Stack className={classes.wrapper}>
              <Accordion
                value={openValue}
                onChange={setOpenValue}
                chevron={false}
                className={classes.accordion}
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
                      type,
                    })
                  }
                >
                  <IconArrowDown />
                </ActionIcon>
              )}
            </Stack>
          ) : (
            <OverlayWithText
              icon={<IconCircleOff className="icon" />}
              text={`No ${type} routines`}
            />
          )}
        </>
      ) : (
        <Loader style={{ margin: "auto" }} />
      )}
    </Stack>
  );
}
