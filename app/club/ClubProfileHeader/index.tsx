import React, { useCallback } from "react";
import { IconChevronLeft, IconHistory } from "@tabler/icons-react";
import { ActionIcon, Group, rem, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useRouter } from "@/helpers/custom-router";
import FollowHistoryModalContent from "../FollowHistoryModalContent";
import classes from "./ClubProfileHeader.module.css";

export default function ClubProfileHeader() {
  const router = useRouter();

  const openFollowHistory = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component={"p"}>
          Follow history
        </Title>
      ),
      centered: true,
      size: "xs",
      h: rem(400),
      innerProps: <FollowHistoryModalContent />,
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
        <Title order={1}>Club profile</Title>
      </Group>

      <ActionIcon onClick={openFollowHistory} variant="default">
        <IconHistory className="icon" />
      </ActionIcon>
    </Group>
  );
}
