import React from "react";
import { IconEye } from "@tabler/icons-react";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./FollowHistoryModalCard.module.css";

type Props = {
  data: {
    avatar: { [key: string]: any };
    followingUserName: string;
  };
  onClick: (userId: string) => void;
};

export default function FollowHistoryModalCard({ data, onClick }: Props) {
  const { avatar, followingUserName } = data;

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Group className={classes.container}>
        <Group className={classes.header}>
          <AvatarComponent avatar={avatar} />
          <Text className={classes.name} lineClamp={1}>
            {followingUserName}
          </Text>
        </Group>

        <Button onClick={() => onClick(followingUserName)} variant="default">
          <IconEye className={`icon ${classes.icon}`} /> Follow again
        </Button>
      </Group>
    </Skeleton>
  );
}
