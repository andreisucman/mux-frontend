import React, { useCallback, useContext } from "react";
import { IconCircleHalfVertical, IconEye } from "@tabler/icons-react";
import { Button, rem, Stack, Text } from "@mantine/core";
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

  const handleTrackUser = useCallback(async () => {
    try {
      if (!userName) throw new Error("User name is missing");

      const response = await callTheServer({
        endpoint: "trackUser",
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
    } catch (err) {
      console.log("Error in handleTrackUser: ", err);
    }
  }, [userName, userDetails]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <IconCircleHalfVertical className="icon icon__title" />
        <Text>Follow to see</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Button className={classes.button} onClick={handleTrackUser} mt={8}>
          <IconEye className="icon" style={{ marginRight: rem(6) }} /> Follow
        </Button>
      </Stack>
    </Stack>
  );
}
