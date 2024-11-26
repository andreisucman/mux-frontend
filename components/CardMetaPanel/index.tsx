import React from "react";
import Link from "next/link";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import AvatarComponent from "../AvatarComponent";
import ScoreCell from "../ScoreCell";
import classes from "./CardMetaPanel.module.css";

type Props = {
  avatar?: { [key: string]: any };
  userId: string;
  name: string;
  faceProgress: number;
  bodyProgress: number;
  customStyles?: { [key: string]: any };
};

export default function CardMetaPanel({
  avatar,
  userId,
  name,
  faceProgress,
  bodyProgress,
  customStyles,
}: Props) {
  return (
    <UnstyledButton
      className={classes.container}
      style={customStyles ? customStyles : {}}
      component={Link}
      href={`/club/about?trackedUserId=${userId}`}
    >
      <Group className={classes.nameWrapper}>
        <AvatarComponent avatar={avatar} size="xs" />
        <Text lineClamp={2} fw={600}>
          {name}
        </Text>
      </Group>
      <Group className={classes.scoreWrapper}>
        <ScoreCell icon={<IconMoodSmile className="icon" />} score={faceProgress} />
        <ScoreCell icon={<IconMan className="icon" />} score={bodyProgress} />
      </Group>
    </UnstyledButton>
  );
}
