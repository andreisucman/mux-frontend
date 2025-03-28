import React from "react";
import { IconCash, IconCreditCard, IconEye, IconLock } from "@tabler/icons-react";
import { Button, Stack, Table } from "@mantine/core";
import classes from "./LeaveClubConfirmation.module.css";

const tableData = {
  body: [
    [
      <IconLock className="icon icon__title" />,
      "All your data, will become private if it was public.",
    ],
    [
      <IconEye className="icon icon__title" />,
      "People who have already purchased the access to your data will keep it.",
    ],
    [
      <IconCreditCard className="icon icon__title" />,
      "If you have any subscribers they will be lost.",
    ],
    [
      <IconCash className="icon icon__title" />,
      "You are responsible for withdrawing your balance before you leave.",
    ],
  ],
};

type Props = {
  handleLeaveClub: () => void;
};

export default function LeaveClubConfirmation({ handleLeaveClub }: Props) {
  return (
    <Stack className={classes.container}>
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Button variant="default" onClick={handleLeaveClub} mt={16}>
        Leave the Club
      </Button>
    </Stack>
  );
}
