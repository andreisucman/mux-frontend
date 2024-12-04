import React, { useCallback, useContext, useState } from "react";
import { IconDeviceFloppy, IconTargetOff } from "@tabler/icons-react";
import { AvatarConfig } from "react-nice-avatar";
import { ActionIcon, Group, Stack, TextInput, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import DataSharingSwitches from "@/app/club/registration/DataSharingSwitches";
import AvatarComponent from "@/components/AvatarComponent";
import AvatarEditor from "@/components/AvatarEditor";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import LeaveClubConfirmation from "./LeaveClubConfirmation";
import classes from "./ClubSettings.module.css";

export type UpdateClubInfoProps = {
  type: "name" | "avatar";
  data: AvatarConfig | string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ClubSettings() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { avatar, name, nextAvatarUpdateAt, nextNameUpdateAt } = club || {};

  const [userName, setUserName] = useState<string>(name || "");
  const [isLoading, setIsLoading] = useState(false);

  const canUpdateName = new Date() > new Date(nextNameUpdateAt || 0);
  const canUpdateAvatar = new Date() > new Date(nextAvatarUpdateAt || 0);

  const isNameDirty = userName.trim() !== name?.trim();

  const openLeaveClubConfirmation = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      innerProps: <LeaveClubConfirmation />,
      title: (
        <Title order={5} component={"p"}>
          When you leave the Club
        </Title>
      ),
    });
  }, []);

  const updateClubInfo = useCallback(async ({ type, data, setIsLoading }: UpdateClubInfoProps) => {
    try {
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateClubData",
        method: "POST",
        body: { type, data },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        setUserDetails((prev: UserDataType) => ({ ...prev, club: { ...prev.club, [type]: data } }));
        modals.closeAll();
      }
    } catch (err) {
      console.log("Error in updateClubInfo: ", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateClubInfo = useCallback(
    async ({ type, data, setIsLoading }: UpdateClubInfoProps) => {
      let children = `You can update your ${type} once a ${type === "name" ? "month" : "week"} only. Are you sure?`;
      modals.openConfirmModal({
        children,
        labels: { confirm: "yes", cancel: "no" },
        onConfirm: () => updateClubInfo({ type, data, setIsLoading }),
      });
    },
    []
  );

  const openAvatarEditor = useCallback(() => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Edit avatar
        </Title>
      ),
      modal: "general",
      centered: true,
      size: "md",
      innerProps: (
        <AvatarEditor
          canUpdateAvatar={canUpdateAvatar}
          currentConfig={avatar as AvatarConfig}
          handleUpdateClubInfo={handleUpdateClubInfo}
        />
      ),
    });
  }, []);

  return (
    <Stack className={classes.stack}>
      <Title order={2} fz={18}>
        Club
      </Title>
      <Stack className={classes.list}>
        <Group>
          <div className={classes.avatarWrapper} onClick={openAvatarEditor}>
            <AvatarComponent avatar={avatar} size="md" />
          </div>
          <TextInput
            value={name}
            disabled={!canUpdateName}
            onChange={(e) => setUserName(e.currentTarget.value)}
            rightSection={
              <ActionIcon
                disabled={!isNameDirty || isLoading || !canUpdateName}
                onClick={() => handleUpdateClubInfo({ data: userName, type: "name", setIsLoading })}
              >
                <IconDeviceFloppy className="icon" />
              </ActionIcon>
            }
          />
        </Group>
        <DataSharingSwitches title="Data privacy" />
        <UnstyledButton className={classes.item} onClick={openLeaveClubConfirmation}>
          <IconTargetOff className={`${classes.icon} icon`} /> Leave the Club
        </UnstyledButton>
      </Stack>
    </Stack>
  );
}
