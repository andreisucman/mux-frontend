import React, { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import classes from "./FollowHistoryModalCard.module.css";

type Props = {
  data: {
    avatar: { [key: string]: any };
    name: string;
    trackedUserId: string;
  };
  onClick: (userId: string) => void;
};

export default function FollowHistoryModalCard({ data, onClick }: Props) {
  const { avatar, name, trackedUserId } = data;
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Group className={classes.container}>
        <AvatarComponent avatar={avatar} />
        <Text className={classes.name} lineClamp={1}>
          {name}
        </Text>
        <Button onClick={() => onClick(trackedUserId)} variant="default">
          <IconEye className={`icon ${classes.icon}`} /> Follow again
        </Button>
      </Group>
    </Skeleton>
  );
}
