"use client";

import React, { useMemo } from "react";
import { IconRotateDot } from "@tabler/icons-react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ConcernsSortCard from "@/app/sort-concerns/ConcernsSortCard";
import GlowingButton from "@/components/GlowingButton";
import signIn from "@/functions/signIn";
import { useRouter } from "@/helpers/custom-router";
import { TypeEnum, UserConcernType } from "@/types/global";
import classes from "./ConcernsCard.module.css";

type Props = {
  title: string;
  type: TypeEnum;
  concerns: UserConcernType[];
};

function ConcernsCard({ concerns, type, title }: Props) {
  const router = useRouter();
  const { height: containerHeight, ref } = useElementSize();

  const maxHeight = useMemo(() => {
    const elementsMaxHeight = concerns.length * 80 + (concerns.length - 1) * 16;
    const containerMaxHeight = containerHeight - 16 - 38;
    return Math.min(elementsMaxHeight, containerMaxHeight);
  }, [concerns.length, containerHeight > 0]);

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container} ref={ref}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <Stack className={classes.wrapper}>
          <ConcernsSortCard concerns={concerns} type={type} maxHeight={maxHeight} disabled />
          <GlowingButton
            text="Create routine free"
            icon={<IconRotateDot className="icon" />}
            onClick={() => signIn({ router, state: { redirectTo: "/my-routines" } })}
            containerStyles={{ flex: 0 }}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}

export default ConcernsCard;
