import React from "react";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import Link from "@/helpers/custom-router/patch-router/link";
import AvatarComponent from "../AvatarComponent";
import ScoreCell from "../ScoreCell";
import classes from "./CardMetaPanel.module.css";

type Props = {
  avatar?: { [key: string]: any } | null;
  name: string | null;
  formattedDate: string;
  customStyles?: { [key: string]: any };
};

export default function CardMetaPanel({ avatar, name, formattedDate, customStyles }: Props) {
  return (
    <UnstyledButton
      className={classes.container}
      style={customStyles ? customStyles : {}}
      component={Link}
      href={`/club/${name}`}
    >
      <Group className={classes.nameWrapper}>
        <AvatarComponent avatar={avatar} size="xs" />
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
