"use client";

import React, { useCallback, useContext } from "react";
import { IconCreditCard, IconInfoCircle, IconSquareCheck } from "@tabler/icons-react";
import { Alert, Stack,Button, Title, UnstyledButton } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { formatDate } from "@/helpers/formatDate";
import openSuccessModal from "@/helpers/openSuccessModal";
import { UserDataType } from "@/types/global";
import ClubSettings from "./ClubSettings";
import classes from "./settings.module.css";

export default function Settings() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, club } = userDetails || {};

  const deleteOn = new Date();

  const redirectToBillingPortal = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "createBillingPortalSession",
        method: "POST",
      });

      if (response.status === 200) {
        window.location.href = response.message;
      }
    } catch (err) {
      console.log("Error in redirectToBillingPortal: ", err);
    }
  }, []);

  const deleteAccount = useCallback(
    async (isDelete: boolean) => {
      try {
        const response = await callTheServer({
          endpoint: "updateAccountDeletion",
          method: "POST",
          body: { isActivate: !isDelete },
        });

        if (response.status === 200) {
          if (userId) {
            setUserDetails((prev: UserDataType) => ({
              ...prev,
              deleteOn: new Date(response.message),
            }));
          }

          openSuccessModal({
            description: "Your account is scheduled for deletion after 30 days.",
          });
        }
      } catch (err) {
        console.log("Error in deleteAccount: ", err);
      }
    },
    [userId]
  );

  const formattedDeleteOnDate = formatDate({ date: deleteOn || new Date() });

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Settings" showReturn hidePartDropdown hideTypeDropdown />
      <Stack className={classes.content}>
        <Stack className={classes.stack}>
          <Title order={2} fz={18}>
            Account
          </Title>
          {/* {deleteOn && ( */}
          <Alert variant="light">
            <Stack gap={8}>
              <Title order={5}>Warning!</Title>
              Your account is scheduled for deletion on {formattedDeleteOnDate}
              <Button ml="auto" onClick={() => deleteAccount(false)}>
                <IconSquareCheck className={`${classes.icon} icon`} /> Reactivate
              </Button>
            </Stack>
          </Alert>
          {/* )} */}
          <Stack className={classes.list}>
            <UnstyledButton className={classes.item} onClick={redirectToBillingPortal}>
              <IconCreditCard className={`${classes.icon} icon`} /> Manage subscriptions
            </UnstyledButton>
            {/* {!deleteOn && ( */}
            <UnstyledButton className={classes.item} onClick={() => deleteAccount(true)}>
              <IconInfoCircle className={`${classes.icon} icon`} /> Delete account
            </UnstyledButton>
            {/* )} */}
          </Stack>
        </Stack>
        {club && <ClubSettings />}
      </Stack>
    </Stack>
  );
}
