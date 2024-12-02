"use client";

import React, { useContext } from "react";
import {
  IconCamera,
  IconCash,
  IconRating18Plus,
  IconTargetArrow,
  IconTargetOff,
} from "@tabler/icons-react";
import { rem, Stack, Table } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import { UserContext } from "@/context/UserContext";
import joinClub from "@/functions/joinClub";
import { useRouter } from "@/helpers/custom-router";
import classes from "./Confirmation.module.css";

const tableData = {
  body: [
    [
      <IconCamera className="icon icon__title" />,
      "All of your data, i.e. the images of your face and body, and task completion videos are private by default. You can enable sharing them in the settings.",
    ],
    [
      <IconCash className="icon icon__title" />,
      "You will earn a share of subscription fee from each follower. The payments will be deposited to your bank account.",
    ],
    [
      <IconTargetOff className="icon icon__title" />,
      "If you leave the Club the data you've made public will become private immediately.",
    ],
    [
      <IconRating18Plus className="icon icon__title" />,
      "You must be over 18 years old to join the Club. Your age will be verified during the registration.",
    ],
  ],
};

export default function Confirmation() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);

  return (
    <Stack flex={1}>
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Stack className={classes.checkboxWrapper}>
        <GlowingButton
          text="Join the Club"
          icon={<IconTargetArrow className="icon" style={{ marginRight: rem(8) }} />}
          onClick={() =>
            joinClub({
              router,
              userDetails,
              setUserDetails,
              redirectPath: "/club/registration",
              closeModal: true,
            })
          }
        />
      </Stack>
    </Stack>
  );
}
