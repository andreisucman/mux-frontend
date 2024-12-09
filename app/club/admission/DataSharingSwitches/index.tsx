import React, { useCallback, useContext } from "react";
import { Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { updateClubPrivacy } from "@/helpers/clubPrivacy";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import SwitchBox from "./SwitchBox";
import classes from "./DataSharingSwitches.module.css";

type Props = {
  title?: string;
};

export default function DataSharingSwitches({ title }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { privacy } = club || {};

  type UpdatePrivacyProps = {
    value: boolean;
    type: string;
    part?: string;
  };

  const updatePrivacy = useCallback(
    async ({ value, type, part }: UpdatePrivacyProps) => {
      if (!club) return;

      const newPrivacy = updateClubPrivacy({ club, part, type, value });

      try {
        const response = await callTheServer({
          endpoint: "updateClubPrivacy",
          method: "POST",
          body: { privacy: newPrivacy },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({
              description: response.error,
            });
            return;
          }
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: { ...club, privacy: newPrivacy },
          }));
        }
      } catch (err) {
        console.log("Error in updatePrivacy: ", err);
      }
    },
    [club]
  );

  return (
    <Stack className={classes.container}>
      {title && (
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
      )}
      <Stack className={classes.wrapper}>
        <SwitchBox type={"head"} privacy={privacy} onChange={updatePrivacy} />
        <SwitchBox type={"body"} privacy={privacy} onChange={updatePrivacy} />
        <SwitchBox type={"health"} privacy={privacy} onChange={updatePrivacy} />
      </Stack>
    </Stack>
  );
}
