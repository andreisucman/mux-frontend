import React from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Stack, Text } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import classes from "./DisplayClubAbout.module.css";

type Props = {
  about: string;
};

export default function DisplayClubAbout({ about }: Props) {
  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        {about ? (
          <Text className={classes.text}>{about}</Text>
        ) : (
          <OverlayWithText text={"Nothing found"} icon={<IconCircleOff className="icon" />} />
        )}
      </Stack>
    </Stack>
  );
}
