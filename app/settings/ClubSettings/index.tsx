import React, { useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { IconDeviceFloppy, IconPencil, IconTargetOff, IconWorld } from "@tabler/icons-react";
import cn from "classnames";
import {
  ActionIcon,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import AvatarComponent from "@/components/AvatarComponent";
import AvatarEditor from "@/components/AvatarEditor";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import askConfirmation from "@/helpers/askConfirmation";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { AvatarType, UserDataType } from "@/types/global";
import AddClubSocials from "./AddClubSocials";
import LeaveClubConfirmation from "./LeaveClubConfirmation";
import classes from "./ClubSettings.module.css";

export type UpdateClubInfoProps = {
  type: "name" | "avatar" | "intro";
  data: AvatarType | string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MAX_INTRO_CHARACTERS = 180;

export default function ClubSettings() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const { club, avatar, name, country } = userDetails || {};
  const { intro, nextAvatarUpdateAt, nextNameUpdateAt } = club || {};

  const [userName, setUserName] = useState<string>(name || "");
  const [userIntro, setUserIntro] = useState<string>(intro || "");
  const [isLoading, setIsLoading] = useState(false);

  const canUpdateName = new Date() > new Date(nextNameUpdateAt || 0);
  const canUpdateAvatar = new Date() > new Date(nextAvatarUpdateAt || 0);

  const isNameDirty = userName.trim() !== name?.trim();
  const isIntroDirty = userIntro.trim() !== intro?.trim();

  const handleLeaveClub = useCallback(async () => {
    modals.closeAll();
    router.push("/tasks");

    const response = await callTheServer({
      endpoint: "leaveClub",
      method: "POST",
    });

    if (response.status === 200) {
      setUserDetails((prev: UserDataType) => ({
        ...prev,
        club: { ...prev.club, isActive: false },
      }));
    } else {
      openErrorModal({
        description: "Please contact us at info@muxout.com",
      });
    }
  }, [router, userDetails]);

  const openLeaveClubConfirmation = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      classNames: { overlay: "overlay" },
      innerProps: (
        <LeaveClubConfirmation
          handleLeaveClub={() =>
            askConfirmation({
              title: "Please confirm",
              body: "You won't be able to rejoin for 7 days. Continue?",
              onConfirm: handleLeaveClub,
            })
          }
        />
      ),
      title: (
        <Title order={5} component={"p"}>
          When you leave the Club
        </Title>
      ),
    });
  }, [userDetails, handleLeaveClub]);

  const handleChangeCountry = useCallback(
    async (newCountry: string) => {
      setIsLoading(true);
      const response = await callTheServer({
        endpoint: "changeCountry",
        method: "POST",
        body: { newCountry },
      });
      setIsLoading(false);

      if (response.status === 200) {
        const { defaultClubPayoutData } = response.message;

        setUserDetails((prev: UserDataType) => ({
          ...prev,
          country: newCountry,
          club: { ...prev.club, payouts: defaultClubPayoutData },
        }));

        router.push("/club");

        modals.closeAll();
      } else {
        openErrorModal();
        setIsLoading(true);
      }
    },
    [userDetails, router]
  );

  const openChangeCountryConfirmation = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      classNames: { overlay: "overlay" },
      innerProps: (
        <SelectCountry
          onClick={(newCountry: string) =>
            askConfirmation({
              title: "Please confirm",
              body: "Changing country requires creating a new wallet. You will have to fill in your details and add a new bank account. Continue?",
              onConfirm: () => handleChangeCountry(newCountry),
              onCancel: () => modals.closeAll(),
            })
          }
        />
      ),
      title: (
        <Title component={"p"} order={5}>
          Enter your country
        </Title>
      ),
    });
  }, [userDetails, handleLeaveClub]);

  const updateClubInfo = useCallback(
    async ({ type, data, setIsLoading }: UpdateClubInfoProps) => {
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateUserData",
        method: "POST",
        body: { [type]: data },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          setIsLoading(false);

          setUserName(name || "");
          setUserIntro(intro || "");
          return;
        }

        setUserName(response.message.name);
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          ...response.message,
        }));

        modals.closeAll();
      }

      setIsLoading(false);
    },
    [userDetails]
  );

  const handleUpdateClubInfo = useCallback(
    async ({ type, data, setIsLoading }: UpdateClubInfoProps) => {
      if (!data) return;

      let children = `You can update your ${type} once a month only. Continue?`;

      modals.openConfirmModal({
        children,
        title: (
          <Title order={5} component={"p"}>
            Confirm operation
          </Title>
        ),
        centered: true,
        classNames: { overlay: "overlay" },
        labels: { confirm: "Yes", cancel: "No" },
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
      classNames: { overlay: "overlay" },
      closeOnClickOutside: false,
      innerProps: (
        <AvatarEditor
          avatar={avatar}
          canUpdateAvatar={canUpdateAvatar}
          handleUpdateClubInfo={handleUpdateClubInfo}
        />
      ),
    });
  }, [canUpdateAvatar, avatar]);

  const handleEnterIntro = (text: string) => {
    if (text.length > MAX_INTRO_CHARACTERS) return;
    setUserIntro(text);
  };

  const showSkeleton = useShowSkeleton();

  const introCharactersLeft = MAX_INTRO_CHARACTERS - userIntro.length;

  return (
    <Skeleton className={classes.container} visible={showSkeleton}>
      <Stack className={classes.wrapper}>
        <Title order={2} fz={18}>
          Club
        </Title>
        <Stack className={classes.list}>
          <Stack gap={12}>
            <Group>
              <div className={classes.avatarWrapper} onClick={openAvatarEditor}>
                <AvatarComponent avatar={avatar} size="md" />
              </div>
              <TextInput
                flex={1}
                value={userName}
                disabled={!canUpdateName}
                onChange={(e) => setUserName(e.currentTarget.value)}
                rightSection={
                  <ActionIcon
                    disabled={!isNameDirty || isLoading || !canUpdateName}
                    onClick={() =>
                      handleUpdateClubInfo({ data: userName, type: "name", setIsLoading })
                    }
                  >
                    <IconDeviceFloppy size={16} />
                  </ActionIcon>
                }
              />
            </Group>
            <TextInput
              flex={1}
              value={userIntro}
              onChange={(e) => handleEnterIntro(e.currentTarget.value)}
              leftSection={<Text size="xs">{introCharactersLeft}</Text>}
              leftSectionWidth={50}
              rightSection={
                <ActionIcon
                  disabled={!isIntroDirty || userIntro.length === 0}
                  onClick={() => updateClubInfo({ data: userIntro, type: "intro", setIsLoading })}
                >
                  <IconDeviceFloppy size={16} />
                </ActionIcon>
              }
            />
          </Stack>
          <AddClubSocials title="Socials" />
          {country && (
            <Stack gap={8}>
              <Text size="sm" c="dimmed">
                Country
              </Text>
              <TextInput
                leftSection={<IconWorld size={20} />}
                value={country || ""}
                readOnly
                rightSection={
                  <ActionIcon variant="default" size="sm" onClick={openChangeCountryConfirmation}>
                    <IconPencil size={16} />
                  </ActionIcon>
                }
              />
            </Stack>
          )}
          <UnstyledButton className={classes.item} onClick={openLeaveClubConfirmation}>
            <IconTargetOff className={classes.icon} size={20} /> Leave the Club
          </UnstyledButton>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
