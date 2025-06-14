import React, { useEffect, useMemo, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { Group, rem, Skeleton, Text, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./ViewsCounter.module.css";

type Props = {
  userName: string;
  page: "routines" | "progress" | "diary" | "proof";
};

const formatViews = (views: number): string => {
  if (views < 1_000) return views.toString();
  const truncated = Math.floor(views / 100) / 10; // e.g. 25 555 → 255 → 25.5
  return `${truncated}k`;
};

export default function ViewsCounter({ userName, page }: Props) {
  const [views, setViews] = useState(0);
  const [openTooltip, setOpenTooltip] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(false));

  const formattedViews = useMemo(() => formatViews(views), [views]);

  useEffect(() => {
    if (!userName) return;

    callTheServer({
      endpoint: `getGrandTotalViews/${userName}?page=${page}&interval=month`,
      method: "GET",
    }).then((res) => {
      if (res.status === 200) {
        setViews(res.message);
      }
    });
  }, [userName]);

  const showSkeleton = useShowSkeleton();

  return (
    <Tooltip
      opened={openTooltip}
      ref={clickOutsideRef}
      label="Views in the last 30 days"
      onClick={() => setOpenTooltip((prev) => !prev)}
      offset={0}
      withArrow
    >
      <Skeleton
        visible={showSkeleton}
        styles={{
          root: { display: "flex", width: "fit-content", minWidth: rem(50), height: rem(32) },
        }}
      >
        <Group className={classes.container}>
          <IconEye size={20} />
          <Text>{formattedViews}</Text>
        </Group>
      </Skeleton>
    </Tooltip>
  );
}
