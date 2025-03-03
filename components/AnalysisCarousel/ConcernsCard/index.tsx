"use client";

import React, { useCallback, useMemo, useState } from "react";
import { rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import ConcernsSortCard from "@/app/sort-concerns/ConcernsSortCard";
import GlowingButton from "@/components/GlowingButton";
import { AuthStateEnum } from "@/context/UserContext/types";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { UserConcernType } from "@/types/global";
import classes from "./ConcernsCard.module.css";

type Props = {
  userId: string | null;
  status: AuthStateEnum;
  title: string;
  concerns: UserConcernType[];
};

function ConcernsCard({ status, userId, concerns, title }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { height: containerHeight, ref } = useElementSize();

  const maxHeight = useMemo(() => {
    const elementsMaxHeight = concerns.length * 100 + (concerns.length - 1) * 16;
    const containerMaxHeight = containerHeight - 16 - 38;
    return Math.min(elementsMaxHeight, containerMaxHeight);
  }, [concerns.length, containerHeight > 0]);

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

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container} ref={ref}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <Title order={2} ta="center" mb={4} mt={4}>
          Start your change
        </Title>
        <Stack className={classes.wrapper}>
          <ConcernsSortCard concerns={concerns} maxHeight={maxHeight} disabled />
          <GlowingButton
            loading={isLoading}
            disabled={isLoading}
            text={"Create routine"}
            containerStyles={{ flex: 0, margin: "0 auto", width: "100%", maxWidth: rem(300) }}
            onClick={handleClick}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}

export default ConcernsCard;
