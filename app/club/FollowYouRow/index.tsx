import React, { memo, useEffect, useState } from "react";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import Link from "@/helpers/custom-router/patch-router/link";
import { ClubUserType } from "@/types/global";
import classes from "./FollowYouRow.module.css";

type Props = {
  data: ClubUserType;
};

function FollowYouRow({ data }: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { _id, name, avatar, scores } = data;

  const headScore = scores.headTotalProgress;
  const bodyScore = scores.bodyTotalProgress;

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton className={`skeleton ${classes.skeleton}`} visible={showSkeleton}>
      <Link className={classes.container} href={`/club/about?followingUserId=${_id}`}>
        <AvatarComponent avatar={avatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {name}
        </Text>

        {headScore !== undefined && (
          <ScoreCell icon={<IconMoodSmile className="icon" />} score={headScore} />
        )}
        {bodyScore !== undefined && (
          <ScoreCell icon={<IconMan className="icon" />} score={bodyScore} />
        )}
      </Link>
    </Skeleton>
  );
}

export default memo(FollowYouRow);
