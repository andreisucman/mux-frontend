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
  name: string;
  headProgress: number;
  bodyProgress: number;
  customStyles?: { [key: string]: any };
};

export default function CardMetaPanel({
  avatar,
  userId,
  name,
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
      <Group className={classes.scoreWrapper}>
        <ScoreCell icon={<IconMoodSmile className="icon" />} score={headProgress} />
        <ScoreCell icon={<IconMan className="icon" />} score={bodyProgress} />
      </Group>
    </UnstyledButton>
  );
}
