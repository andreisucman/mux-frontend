"use client";

import React, { useMemo } from "react";
import { IconRotateDot } from "@tabler/icons-react";
import { rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ConcernsSortCard from "@/app/sort-concerns/ConcernsSortCard";
import GlowingButton from "@/components/GlowingButton";
import signIn from "@/functions/signIn";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { TypeEnum, UserConcernType } from "@/types/global";
import classes from "./ConcernsCard.module.css";

type Props = {
  title: string;
  type: TypeEnum;
  concerns: UserConcernType[];
};

function ConcernsCard({ concerns, type, title }: Props) {
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
        <Title order={2} ta="center" mb={4} mt={4}>
          Start your change
        </Title>
        <Stack className={classes.wrapper}>
          <ConcernsSortCard concerns={concerns} type={type} maxHeight={maxHeight} disabled />
          <GlowingButton
            text="Create routine free"
            icon={<IconRotateDot className="icon" />}
            onClick={() =>
              openAuthModal({
                formType: "registration",
                stateObject: { redirectTo: "routines" },
                title: "Start your change",
                showTos: true,
              })
            }
            containerStyles={{ flex: 0, maxWidth: rem(300), width: "100%", margin: "0 auto" }}
          />
        </Stack>
      </Stack>
    </Skeleton>
  );
}

export default ConcernsCard;
