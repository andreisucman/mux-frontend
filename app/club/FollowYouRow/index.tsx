import React, { memo } from "react";
import { Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import Link from "@/helpers/custom-router/patch-router/link";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { ClubUserType } from "@/types/global";
import classes from "./FollowYouRow.module.css";

type Props = {
  data: ClubUserType;
};

function FollowYouRow({ data }: Props) {
  const { name, avatar, scores } = data;

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton className={`skeleton ${classes.skeleton}`} visible={showSkeleton}>
      <Link className={classes.container} href={`/club/${name}`}>
        <AvatarComponent avatar={avatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {name}
        </Text>

        {scores.totalProgress !== undefined && <ScoreCell score={scores.totalProgress} />}
      </Link>
    </Skeleton>
  );
}

export default memo(FollowYouRow);
