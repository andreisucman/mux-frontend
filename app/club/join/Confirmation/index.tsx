"use client";

import React, { useContext } from "react";
import { IconTargetArrow } from "@tabler/icons-react";
import { rem, Stack, Table } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import { UserContext } from "@/context/UserContext";
import joinClub from "@/functions/joinClub";
import { useRouter } from "@/helpers/custom-router";
import classes from "./Confirmation.module.css";

const tableData = {
  body: [
    [
      "📸",
      "All of your data, i.e. the images of your face and body, and task completion videos are private by default. You can enable sharing them in the settings.",
    ],
    [
      "💸",
      "You will earn a share of subscription fee from each follower. The payments will be deposited to your bank account.",
    ],
    ["🚪", "If you leave the Club the data you've made public will become private immediately."],
    [
      "🔞",
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
