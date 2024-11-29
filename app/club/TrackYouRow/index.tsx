import React, { useMemo } from "react";
import { IconEye, IconMan, IconMoodSmile, IconTrendingUp } from "@tabler/icons-react";
import Avatar, { genConfig } from "react-nice-avatar";
import { Button, Group, Stack, Text } from "@mantine/core";
import { ClubUserType } from "@/types/global";
import classes from "./TrackYouRow.module.css";

interface ExtendedFollowerType extends ClubUserType {
  onClick: (userId: string) => void;
  disabled: boolean;
}

export default function TrackYouRow({
  _id,
  name,
  avatar,
  disabled,
  scores,
  onClick,
}: ExtendedFollowerType) {
  const avatarConfig = useMemo(() => genConfig(avatar), [typeof avatar]);

  return (
    <Group className={classes.container}>
      <Avatar {...avatarConfig} />
      <Text lineClamp={1}>{name}</Text>

      {scores && (
        <>
          {scores.headTotalProgress && (
            <Stack className={classes.cell}>
              <Text className={classes.text}>
                <IconTrendingUp className="icon" /> {scores.headTotalProgress}
              </Text>
              <Text className={classes.text}>
                <IconMoodSmile className="icon" />
                {scores.headTotalProgress}
              </Text>
            </Stack>
          )}
          {scores.bodyTotalProgress && (
            <Stack className={classes.cell}>
              <Text className={classes.text}>
                <IconTrendingUp className="icon" /> {scores.bodyTotalProgress}
              </Text>
              <Text className={classes.text}>
                <IconMan className="icon" />
                {scores.bodyCurrentScore}
              </Text>
            </Stack>
          )}
        </>
      )}
      <Button
        disabled={disabled}
        onClick={() => onClick(_id)}
        className={classes.button}
        variant="default"
      >
        <IconEye className={"icon"} />
      </Button>
    </Group>
  );
}
