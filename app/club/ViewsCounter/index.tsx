import React, { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { Group, rem, Skeleton, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./ViewsCounter.module.css";

export default function ViewsCounter() {
  const [views, setViews] = useState(0);
  const [openTooltip, setOpenTooltip] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(false));

  useEffect(() => {
    callTheServer({ endpoint: "getGrandTotalViews?interval=month", method: "GET" }).then((res) => {
      if (res.status === 200) {
        setViews(res.message);
      }
    });
  }, []);

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
        styles={{ root: { display: "flex", width: "fit-content", minWidth: rem(50), height: rem(32) } }}
      >
        <Group className={classes.container}>
          <IconEye size={20} />
          {views}
        </Group>
      </Skeleton>
    </Tooltip>
  );
}
