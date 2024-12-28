"use client";

import React, { useCallback, useMemo } from "react";
import { IconRotateDot } from "@tabler/icons-react";
import { rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import ConcernsSortCard from "@/app/sort-concerns/ConcernsSortCard";
import GlowingButton from "@/components/GlowingButton";
import { AuthStateEnum } from "@/context/UserContext/types";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { TypeEnum, UserConcernType } from "@/types/global";
import classes from "./ConcernsCard.module.css";

type Props = {
  userId: string | null;
  status: AuthStateEnum;
  title: string;
  type: TypeEnum;
  concerns: UserConcernType[];
};

function ConcernsCard({ status, userId, concerns, type, title }: Props) {
  const router = useRouter();
  const { height: containerHeight, ref } = useElementSize();

  const maxHeight = useMemo(() => {
    const elementsMaxHeight = concerns.length * 80 + (concerns.length - 1) * 16;
    const containerMaxHeight = containerHeight - 16 - 38;
    return Math.min(elementsMaxHeight, containerMaxHeight);
  }, [concerns.length, containerHeight > 0]);

  const handleClick = useCallback(() => {
    if (status === AuthStateEnum.LOADING) return;

    if (status === AuthStateEnum.AUTHENTICATED) {
      router.push("/tasks");
    } else {
      openAuthModal({
        stateObject: {
          redirectPath: "/tasks",
          redirectQuery: `type=${type}`,
          localUserId: userId,
          referrer: ReferrerEnum.ANALYSIS_PROGRESS,
        },
        title: "Start your change",
      });
    }
  }, [status]);

  const buttonText =
    status === AuthStateEnum.AUTHENTICATED ? "Return to the routine" : "Create routine free";

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
          <ConcernsSortCard concerns={concerns} type={type} maxHeight={maxHeight} disabled />
          <GlowingButton
            text={buttonText}
            icon={<IconRotateDot className="icon" style={{ marginRight: rem(6) }} />}
            onClick={handleClick}
            containerStyles={{ flex: 0, margin: "0 auto" }}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}

export default ConcernsCard;
