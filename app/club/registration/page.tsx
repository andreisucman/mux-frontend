"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconBuildingBank, IconRocket, IconSquareCheck } from "@tabler/icons-react";
import { Group, rem, Stack, Text, Title } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import RedirectToWalletButton from "../BalancePane/RedirectToWalletButton";
import DataSharingSwitches from "./DataSharingSwitches";
import classes from "./registration.module.css";

const icons = {
  checkbox: <IconSquareCheck className="icon" />,
  bank: <IconBuildingBank className="icon" />,
  rocket: <IconRocket className="icon" />,
};

export const runtime = "edge";

export default function ClubRegistration() {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [disableFirst, setDisableFirst] = useState(true);
  const [disableSecond, setDisableSecond] = useState(true);

  const { club: clubData } = userDetails || {};
  const { payouts } = clubData || {};
  const { detailsSubmitted, payoutsEnabled } = payouts || {};

  console.log("clubData", clubData);

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

  const submittedNotEnabled = detailsSubmitted && !payoutsEnabled;

  useEffect(() => {
    if (!clubData) return;

    setDisableFirst(!!detailsSubmitted);
    setDisableSecond(!detailsSubmitted);
  }, [detailsSubmitted]);

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
                disabled={disableFirst || !clubData}
                onClick={handleCreateConnectAccount}
                containerStyles={{ flex: "unset" }}
              />
              {submittedNotEnabled && <RedirectToWalletButton />}
            </Group>
          </Stack>
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
            <DataSharingSwitches title="Data privacy"/>
            <GlowingButton
              text="Done"
              icon={icons.rocket}
              disabled={disableSecond || !clubData}
              onClick={() => router.push("/club")}
              containerStyles={{ marginRight: "auto", marginTop: rem(4) }}
            />
          </Stack>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
