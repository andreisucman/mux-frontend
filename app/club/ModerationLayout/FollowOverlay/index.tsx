import React, { useCallback, useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { Button, rem, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { ClubDataType, UserDataType } from "@/types/global";
import classes from "./FollowOverlay.module.css";

type Props = {
  userName?: string;
  description: string;
};

export default function FollowOverlay({ userName, description }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);

  const handleFollowUser = useCallback(async () => {
    try {
      if (!userName) throw new Error("User name is missing");

      const response = await callTheServer({
        endpoint: "followUser",
        method: "POST",
        body: { followingUserName: userName },
      });

      if (response.status === 200) {
        const { club } = userDetails || {};
        const newClub = { ...club, userName };

        if (club) {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: newClub as ClubDataType,
          }));
        }
      }
    } catch (err) {}
  }, [userName, userDetails]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Title order={4}>Follow to see</Title>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Button className={classes.button} onClick={handleFollowUser} mt={8}>
           Follow
        </Button>
      </Stack>
    </Stack>
  );
}
