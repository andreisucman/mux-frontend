import React, { useCallback, useContext, useState } from "react";
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
  const [openTooltip, setOpenTooltip] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { privacy } = club || {};

  type UpdatePrivacyProps = {
    value: boolean;
    type?: string;
    category: string;
  };

  const updatePrivacy = useCallback(
    async ({ value, category, type }: UpdatePrivacyProps) => {
      if (!club) return;

      console.log("updatePrivacy inputs", value, type, category);
      const newPrivacy = updateClubPrivacy({ club, category, type, value });
      console.log("newPrivacy", newPrivacy);
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
      } catch (err) {}
    },
    [userDetails, privacy]
  );

  return (
    <Stack className={classes.container}>
      {title && (
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
      )}
      <Stack className={classes.wrapper}>
        <SwitchBox
          category={"about"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
        <SwitchBox
          category={"progress"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
        <SwitchBox
          category={"proof"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
        <SwitchBox
          category={"style"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
        <SwitchBox
          category={"diary"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
        <SwitchBox
          category={"answer"}
          privacy={privacy}
          onChange={updatePrivacy}
          openTooltip={openTooltip}
          setOpenTooltip={setOpenTooltip}
        />
      </Stack>
    </Stack>
  );
}
