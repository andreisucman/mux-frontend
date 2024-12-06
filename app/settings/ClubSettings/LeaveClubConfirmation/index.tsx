import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { IconCash, IconEye, IconLock, IconTargetOff } from "@tabler/icons-react";
import { Button, Stack, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
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

export default function LeaveClubConfirmation() {
  const { setUserDetails } = useContext(UserContext);
  const router = useRouter();

  const leaveClub = async () => {
    try {
      const response = await callTheServer({
        endpoint: "leaveClub",
        method: "POST",
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({ ...prev, ...response.message }));

        router.push("/routines");
        modals.closeAll();
      }
    } catch (err) {
      openErrorModal({
        description: "Please contact us at info@maxyouout.com",
      });
    }
  };

  return (
    <Stack className={classes.container}>
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Button variant="default" onClick={leaveClub}>
        <IconTargetOff className={`${classes.icon} icon`} /> Leave the Сlub
      </Button>
    </Stack>
  );
}
