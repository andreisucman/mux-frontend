"use client";

import React, { useCallback, useMemo, useState } from "react";
import { rem, Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import DragAndDrop from "@/app/sort-concerns/ConcernsSortCard/DragAndDrop";
import GlowingButton from "@/components/GlowingButton";
import { AuthStateEnum } from "@/context/UserContext/types";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { LatestScoresType, UserConcernType } from "@/types/global";
import classes from "./ConcernsCard.module.css";

type Props = {
  userId: string | null;
  status: AuthStateEnum;
  title: string;
  concerns: UserConcernType[];
  latestScores?: LatestScoresType;
};

function ConcernsCard({ status, userId, concerns, title }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { height: containerHeight, ref } = useElementSize();

  const handleClick = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    if (status === AuthStateEnum.AUTHENTICATED) {
      router.push("/routines");
    } else {
      openAuthModal({
        stateObject: {
          redirectPath: "/routines",
          localUserId: userId,
          referrer: ReferrerEnum.ANALYSIS_PROGRESS,
        },
        title: "Start your change",
      });

      setIsLoading(false);
    }
  }, [status, userId, isLoading]);

  const maxHeight = useMemo(() => {
    const elementsMaxHeight = concerns.length * 100 + (concerns.length - 1) * 16;
    const containerMaxHeight = containerHeight - 16 - 38;
    return Math.min(elementsMaxHeight, containerMaxHeight);
  }, [concerns.length, containerHeight > 0]);

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={`${classes.container} scrollbar`} ref={ref}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>

        <DragAndDrop
          disabled={true}
          data={concerns}
          onUpdate={() => {}}
          handleUpdateConcern={() => {}}
        />
        <GlowingButton
          loading={isLoading}
          disabled={isLoading}
          text={"Create routine"}
          containerStyles={{ flex: 0, margin: "1rem auto", width: "100%", maxWidth: rem(300) }}
          onClick={handleClick}
        />
      </Stack>
    </Skeleton>
  );
}

export default ConcernsCard;
