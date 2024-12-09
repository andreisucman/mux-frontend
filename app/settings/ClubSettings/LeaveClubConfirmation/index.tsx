import React from "react";
import { IconCash, IconEye, IconLock, IconTargetOff } from "@tabler/icons-react";
import { Button, Stack, Table } from "@mantine/core";
import classes from "./LeaveClubConfirmation.module.css";

const tableData = {
  body: [
    [
      <IconLock className="icon icon__title" />,
      "All your data, i.e. the images of your face and body, and task completion videos will become private if they were public.",
    ],
    [
      <IconCash className="icon icon__title" />,
      "Your outstanding balance will be paid to you and you will stop earning.",
    ],
    [<IconEye className="icon icon__title" />, "All of your followers will be lost forever."],
  ],
};

type Props = {
  handleLeaveClub: () => void;
};

export default function LeaveClubConfirmation({ handleLeaveClub }: Props) {
  return (
    <Stack className={classes.container}>
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Button variant="default" onClick={handleLeaveClub}>
        <IconTargetOff className={`${classes.icon} icon`} /> Leave the Сlub
      </Button>
    </Stack>
  );
}
