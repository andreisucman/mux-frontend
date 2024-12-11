"use client";

import React, { useCallback, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { IconBuildingBank, IconInfoCircle, IconRocket, IconSquareCheck } from "@tabler/icons-react";
import { Alert, Group, rem, Stack, Text, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import RedirectToWalletButton from "../BalancePane/RedirectToWalletButton";
import DataSharingSwitches from "./DataSharingSwitches";
import classes from "./admission.module.css";

const icons = {
  checkbox: <IconSquareCheck className="icon" style={{ marginRight: rem(6) }} />,
  bank: <IconBuildingBank className="icon" style={{ marginRight: rem(6) }} />,
  rocket: <IconRocket className="icon" style={{ marginRight: rem(6) }} />,
};

export const runtime = "edge";

export default function ClubAdmission() {
  const pathname = usePathname();
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [disableFirst, setDisableFirst] = useState(true);
  const [disableSecond, setDisableSecond] = useState(true);

  const { club } = userDetails || {};
  const { payouts } = club || {};
  const { detailsSubmitted, payoutsEnabled, disabledReason } = payouts || {};

  const submittedNotEnabled = detailsSubmitted && !payoutsEnabled;

  const handleCreateConnectAccount = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "createConnectAccount",
        method: "POST",
      });

      if (response.status === 200) {
        router.push(response.message);
      }
    } catch (err) {
      console.log("Error in handleCreateConnectAccount: ", err);
    }
  }, []);

  useShallowEffect(() => {
    if (!userDetails) return;

    setDisableFirst(!!detailsSubmitted);
    setDisableSecond(!detailsSubmitted);
  }, [userDetails, pathname]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader title="Club admission" showReturn hidePartDropdown hideTypeDropdown />
        <Stack className={classes.content}>
          <Stack>
            <Title order={4}>1. Add your bank for payouts</Title>
            <Text>
              Register a wallet and connect your bank for receiving payments. You&apos;ll have to
              provide some personal information to verify your identity and age.
            </Text>
            <Group gap={16} justify="space-between">
              <GlowingButton
                icon={detailsSubmitted ? icons.checkbox : icons.bank}
                text={detailsSubmitted ? "Bank added" : "Add bank"}
                disabled={disableFirst}
                onClick={handleCreateConnectAccount}
                containerStyles={{ flex: "unset" }}
              />
            </Group>
          </Stack>
          {submittedNotEnabled && (
            <Alert variant="default" icon={<IconInfoCircle className="icon" />}>
              <Stack gap={8}>
                <Title order={5}>Verifying</Title>
                Your information is still being verified. Meanwhile you can explore the club. If you
                need to edit your information you can do it in the wallet.
                <RedirectToWalletButton variant="default" />
              </Stack>
            </Alert>
          )}
          {!payoutsEnabled && disabledReason && (
            <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
              <Stack gap={8}>
                <Title order={5}>Payouts disabled</Title>
                Your payouts have been disabled. Please log into your wallet to fix that.
                <RedirectToWalletButton variant="filled" />
              </Stack>
            </Alert>
          )}

          <Stack>
            <Title order={4}>2. Decide which data to share</Title>
            <Text>
              This data will appear in the before-after cards on the main page as well as on your
              Club profile page.
            </Text>
            <Text>
              Sharing your data gives people a reason to follow you which translates into your
              earnings. You can always change your data sharing preferences in the settings of the
              Club profile page.
            </Text>
            <DataSharingSwitches title="Data privacy" />
            <GlowingButton
              text="Done"
              icon={icons.rocket}
              disabled={disableSecond}
              onClick={() => router.push("/club")}
              containerStyles={{ marginTop: rem(4) }}
            />
          </Stack>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
