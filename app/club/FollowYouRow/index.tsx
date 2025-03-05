import React, { memo, useMemo } from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import ScoreCell from "@/components/ScoreCell";
import Link from "@/helpers/custom-router/patch-router/link";
import { getPartIcon } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { ClubUserType } from "@/types/global";
import classes from "./FollowYouRow.module.css";

type Props = {
  data: ClubUserType;
};

function FollowYouRow({ data }: Props) {
  const { name, avatar, latestScoresDifference } = data;

  const showSkeleton = useShowSkeleton();

  const nonZeroParts = useMemo(
    () =>
      Object.entries(latestScoresDifference || {})
        .filter(([key, value]) => typeof value === "number")
        .map(([key, overall]) => {
          const icon = getPartIcon(key, "icon__small");
          return { icon, score: overall };
        }),
    [latestScoresDifference]
  );

  return (
    <Skeleton className={`skeleton ${classes.skeleton}`} visible={showSkeleton}>
      <Link className={classes.container} href={`/club/${name}`}>
        <AvatarComponent avatar={avatar} size="sm" />
        <Text lineClamp={1} className={classes.name}>
          {name}
        </Text>

        {latestScoresDifference.overall > 0 && (
          <>
            <ScoreCell
              score={latestScoresDifference.overall}
              icon={<IconTrendingUp className="icon icon__small" />}
            />
            {nonZeroParts.map((obj, i) => (
              <ScoreCell key={i} score={obj.score as number} icon={obj.icon} />
            ))}
          </>
        )}
      </Link>
    </Skeleton>
  );
}

export default memo(FollowYouRow);
