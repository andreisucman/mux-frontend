import React, { useCallback, useContext } from "react";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { updateClubPrivacy } from "@/helpers/clubPrivacy";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import SwitchBox from "./SwitchBox";

export default function DataSharingSwitches() {
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
    [typeof club]
  );

  return (
    <Stack flex={1}>
      <SwitchBox type={"head"} privacy={privacy} onChange={updatePrivacy} />
      <SwitchBox type={"body"} privacy={privacy} onChange={updatePrivacy} />
      <SwitchBox type={"health"} privacy={privacy} onChange={updatePrivacy} />
    </Stack>
  );
}
