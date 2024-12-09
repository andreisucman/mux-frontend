import React, { useCallback, useContext } from "react";
import { IconAlertTriangle, IconEye } from "@tabler/icons-react";
import { Button, rem, Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { ClubDataType, UserDataType } from "@/types/global";
import classes from "./FollowOverlay.module.css";

type Props = {
  followingUserId: string | null;
  description: string;
};

export default function FollowOverlay({ followingUserId, description }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);

  const handleTrackUser = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "trackUser",
        method: "POST",
        body: { followingUserId },
      });

      if (response.status === 200) {
        const { club } = userDetails || {};
        const newClub = { ...club, followingUserId };

        if (club) {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: newClub as ClubDataType,
          }));
        }
      }
    } catch (err) {
      console.log("Error in handleTrackUser: ", err);
    }
  }, [followingUserId]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <IconAlertTriangle className="icon icon__title" />
        <Text>Follow to see</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Button className={classes.button} onClick={handleTrackUser} mb={4}>
          <IconEye className="icon" style={{ marginRight: rem(8) }} /> Follow
        </Button>
      </Stack>
    </Stack>
  );
}
