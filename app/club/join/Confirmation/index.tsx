"use client";

import React from "react";
import {
  IconCamera,
  IconCash,
  IconRating18Plus,
  IconTargetArrow,
  IconTargetOff,
} from "@tabler/icons-react";
import { rem, Stack, Table } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./Confirmation.module.css";

const tableData = {
  body: [
    [
      <IconCamera className="icon icon__title" />,
      "All of your uploaded data is private by default. You can make it public in the settings.",
    ],
    [
      <IconCash className="icon icon__title" />,
      "You will earn a share of the subscription fee from each follower. The payments will be deposited to your bank account.",
    ],
    [
      <IconTargetOff className="icon icon__title" />,
      "If you leave the Club the data you've made public (if you made it public) will become private immediately.",
    ],
    [
      <IconRating18Plus className="icon icon__title" />,
      "You must be over 18 years old to join the Club. Your age will be verified during the registration.",
    ],
  ],
};

type Props = {
  handleJoinClub: () => void;
};

export default function Confirmation({ handleJoinClub }: Props) {
  return (
    <Stack flex={1}>
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Stack className={classes.checkboxWrapper}>
        <GlowingButton
          text="Join the Club"
          icon={<IconTargetArrow className="icon" style={{ marginRight: rem(6) }} />}
          containerStyles={{ margin: "auto" }}
          onClick={handleJoinClub}
        />
      </Stack>
    </Stack>
  );
}
