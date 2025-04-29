import React from "react";
import Link from "next/link";
import { Button, Group, Text, UnstyledButton } from "@mantine/core";
import { AvatarType } from "@/types/global";
import AvatarComponent from "../AvatarComponent";
import classes from "./CardMetaPanel.module.css";

type Props = {
  avatar?: AvatarType | null;
  redirectUrl: string;
  name: string | null;
  formattedDate: string;
  customStyles?: { [key: string]: any };
};

export default function CardMetaPanel({
  redirectUrl,
  avatar,
  name,
  formattedDate,
  customStyles,
}: Props) {
  return (
    <UnstyledButton
      className={classes.container}
      style={customStyles ? customStyles : {}}
      component={Link}
      href={redirectUrl}
    >
      <Group className={classes.nameWrapper}>
        <AvatarComponent avatar={avatar} size="sm" />
        <Text lineClamp={2} fw={600}>
          {name}
        </Text>
      </Group>
      <Text size="sm" c="dimmed">
        {formattedDate}
      </Text>
    </UnstyledButton>
  );
}
