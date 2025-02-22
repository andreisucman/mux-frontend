import React, { useContext } from "react";
import { Button, Group, Skeleton, Text } from "@mantine/core";
import AvatarComponent from "@/components/AvatarComponent";
import { UserContext } from "@/context/UserContext";
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
  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { followingUserName } = club || {};
  const { avatar, followingUserName: serverFollowingUserName } = data;

  const alreadyFollowing = serverFollowingUserName === followingUserName;

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

        <Button
          disabled={alreadyFollowing}
          onClick={() => onClick(serverFollowingUserName)}
          variant="default"
        >
          {alreadyFollowing ? "Following" : "Follow again"}
        </Button>
      </Group>
    </Skeleton>
  );
}
