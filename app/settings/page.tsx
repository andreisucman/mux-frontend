import React, { useCallback, useContext, useState } from "react";
import {
  IconCreditCard,
  IconDeviceFloppy,
  IconInfoCircle,
  IconSquareCheck,
  IconTargetOff,
} from "@tabler/icons-react";
import { AvatarConfig } from "react-nice-avatar";
import { ActionIcon, Alert, Group, Stack, TextInput, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import AvatarComponent from "@/components/AvatarComponent";
import AvatarEditor from "@/components/AvatarEditor";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { UserDataType } from "@/types/global";
import DataSharingSwitches from "../club/registration/DataSharingSwitches";
import LeaveClubConfirmation from "./LeaveClubConfirmation";
import classes from "./settings.module.css";

export type UpdateClubInfoProps = {
  type: "name" | "avatar";
  data: AvatarConfig | string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Settings() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, club } = userDetails || {};
  const { avatar, name, nextAvatarUpdateAt, nextNameUpdateAt } = club || {};

  const [userName, setUserName] = useState<string>(name || "");
  const [isLoading, setIsLoading] = useState(false);

  const canUpdateName = new Date() > new Date(nextNameUpdateAt || 0);
  const canUpdateAvatar = new Date() > new Date(nextAvatarUpdateAt || 0);

  const isNameDirty = userName.trim() !== name?.trim();

  const deleteOn = new Date();

  const redirectToBillingPortal = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "createBillingPortalSession",
        method: "POST",
      });

      if (response.status === 200) {
        window.location.href = response.message;
      }
    } catch (err) {
      console.log("Error in redirectToBillingPortal: ", err);
    }
  }, []);

  const deleteAccount = useCallback(
    async (isDelete: boolean) => {
      try {
        const response = await callTheServer({
          endpoint: "updateAccountDeletion",
          method: "POST",
          body: { isActivate: !isDelete },
        });

        if (response.status === 200) {
          if (userId) {
            setUserDetails((prev: UserDataType) => ({
              ...prev,
              deleteOn: new Date(response.message),
            }));
          }

          openSuccessModal({
            description: "Your account is scheduled for deletion after 30 days.",
          });
        }
      } catch (err) {
        console.log("Error in deleteAccount: ", err);
      }
    },
    [userId]
  );

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

  const formattedDeleteOnDate = formatDate({ date: deleteOn || new Date() });
  const deleteAccountText = deleteOn ? "Reactivate account" : "Delete account";
  const deleteAccountIcon = deleteOn ? (
    <IconInfoCircle className={`${classes.icon} icon`} />
  ) : (
    <IconSquareCheck className={`${classes.icon} icon`} />
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Settings" showReturn />
      <Stack className={classes.content}>
        <Stack className={classes.stack}>
          <Title order={2} fz={16}>
            Account
          </Title>
          {deleteOn && (
            <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
              Your account is scheduled for deletion on {formattedDeleteOnDate}
            </Alert>
          )}
          <Stack className={classes.list}>
            <UnstyledButton className={classes.button} onClick={redirectToBillingPortal}>
              <IconCreditCard className={`${classes.icon} icon`} /> Manage subscriptions
            </UnstyledButton>
            <UnstyledButton className={classes.button} onClick={() => deleteAccount(!deleteOn)}>
              {deleteAccountIcon} {deleteAccountText}
            </UnstyledButton>
          </Stack>
        </Stack>
        {club && (
          <Stack className={classes.stack}>
            <Title order={2} fz={16}>
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
                      onClick={() =>
                        handleUpdateClubInfo({ data: userName, type: "name", setIsLoading })
                      }
                    >
                      <IconDeviceFloppy className="icon" />
                    </ActionIcon>
                  }
                />
              </Group>
              <DataSharingSwitches title="Data privacy" />
              <UnstyledButton className={classes.button} onClick={openLeaveClubConfirmation}>
                <IconTargetOff className={`${classes.icon} icon`} /> Leave the Club
              </UnstyledButton>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
