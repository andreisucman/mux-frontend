import React, { memo } from "react";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import Link from "@/helpers/custom-router/patch-router/link";
import { ClubUserType } from "@/types/global";
import classes from "./FollowYouRow.module.css";

type Props = {
  data: ClubUserType;
};

function FollowYouRow({ data }: Props) {
  const { _id, name, avatar, scores } = data;

  const headScore = scores.headTotalProgress;
  const bodyScore = scores.bodyTotalProgress;

  return (
    <Link className={classes.container} href={`/club/about?followingUserId=${_id}`}>
      <AvatarComponent avatar={avatar} size="sm" />
      <Text lineClamp={1} className={classes.name}>{name}</Text>

      {headScore !== undefined && (
        <ScoreCell icon={<IconMoodSmile className="icon" />} score={headScore} />
      )}
      {bodyScore !== undefined && (
        <ScoreCell icon={<IconMan className="icon" />} score={bodyScore} />
      )}
    </Link>
  );
}

export default memo(FollowYouRow);
