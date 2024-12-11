import React from "react";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import Link from "@/helpers/custom-router/patch-router/link";
import AvatarComponent from "../AvatarComponent";
import ScoreCell from "../ScoreCell";
import classes from "./CardMetaPanel.module.css";

type Props = {
  avatar?: { [key: string]: any } | null;
  userId: string;
  name: string | null;
  headProgress: number;
  bodyProgress: number;
  formattedDate: string;
  customStyles?: { [key: string]: any };
};

export default function CardMetaPanel({
  avatar,
  userId,
  name,
  formattedDate,
  headProgress,
  bodyProgress,
  customStyles,
}: Props) {
  return (
    <UnstyledButton
      className={classes.container}
      style={customStyles ? customStyles : {}}
      component={Link}
      href={`/club/about?followingUserId=${userId}`}
    >
      <Group className={classes.nameWrapper}>
        <AvatarComponent avatar={avatar} size="xs" />
        <Text lineClamp={2} fw={600}>
          {name}
        </Text>
      </Group>
      {headProgress !== undefined && bodyProgress !== undefined && (
        <Group className={classes.scoreWrapper}>
          {headProgress !== undefined && (
            <ScoreCell icon={<IconMoodSmile className="icon" />} score={headProgress} />
          )}
          {bodyProgress !== undefined && (
            <ScoreCell icon={<IconMan className="icon" />} score={bodyProgress} />
          )}
        </Group>
      )}
      <Text size="sm" c="dimmed">{formattedDate}</Text>
    </UnstyledButton>
  );
}
