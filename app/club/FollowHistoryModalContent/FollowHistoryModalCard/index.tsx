import React, { useEffect, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./FollowHistoryModalCard.module.css";

type Props = {
  data: {
    avatar: { [key: string]: any };
    name: string;
    followingUserId: string;
  };
  onClick: (userId: string) => void;
};

export default function FollowHistoryModalCard({ data, onClick }: Props) {
  const { avatar, name, followingUserId } = data;

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Group className={classes.container}>
        <Group className={classes.header}>
          <AvatarComponent avatar={avatar} />
          <Text className={classes.name} lineClamp={1}>
            {name}
          </Text>
        </Group>

        <Button onClick={() => onClick(followingUserId)} variant="default">
          <IconEye className={`icon ${classes.icon}`} /> Follow again
        </Button>
      </Group>
    </Skeleton>
  );
}
