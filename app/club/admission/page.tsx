"use client";

import React, { useCallback, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { IconBuildingBank, IconInfoCircle, IconRocket, IconSquareCheck } from "@tabler/icons-react";
import { Alert, Group, rem, Stack, Text, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import RedirectToWalletButton from "../BalancePane/RedirectToWalletButton";
import DataSharingSwitches from "./DataSharingSwitches";
import classes from "./admission.module.css";

export const runtime = "edge";

export default function ClubAdmission() {
  const pathname = usePathname();
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [disableFirst, setDisableFirst] = useState(true);
  const [disableSecond, setDisableSecond] = useState(true);
  const [loadingButton, setLoadingButton] = useState<"bank" | "done" | null>(null);

  const { club, country } = userDetails || {};
  const { payouts } = club || {};
  const { detailsSubmitted, payoutsEnabled, disabledReason } = payouts || {};

  const submittedNotEnabled = detailsSubmitted && !payoutsEnabled;

  const handleCreateConnectAccount = useCallback(async () => {
    setLoadingButton("bank");
    try {
      const response = await callTheServer({
        endpoint: "createConnectAccount",
        method: "POST",
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          setUserDetails((prev: UserDataType) => ({ ...prev, country: null }));
          return;
        }
        router.push(response.message);
      } else {
        openErrorModal({ description: response.error });
      }
    } catch (err) {
    } finally {
      setLoadingButton(null);
    }
  }, [userDetails]);

  const handleSetCountryAndCreateAccount = useCallback(
    async (newCountry: string) => {
      setLoadingButton("bank");
      try {
        const response = await callTheServer({
          endpoint: "changeCountry",
          method: "POST",
          body: { newCountry },
        });

        if (response.status === 200) {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            country: newCountry,
            club: { ...prev.club, payouts: response.message },
          }));

          handleCreateConnectAccount();
          modals.closeAll();
        } else {
          openErrorModal();
        }
      } catch (err) {
      } finally {
        setLoadingButton(null);
      }
    },
    [userDetails, router]
  );

  const openCountrySelectModal = useCallback(() => {
    if (!country) {
      modals.openContextModal({
        modal: "general",
        centered: true,
        innerProps: (
          <SelectCountry
            onClick={(newCountry: string) => handleSetCountryAndCreateAccount(newCountry)}
          />
        ),
        title: (
          <Title component={"p"} order={5}>
            Enter your country
          </Title>
        ),
      });
      return;
    }

    handleCreateConnectAccount();
  }, [country]);

  const handleRedirect = useCallback(() => {
    if (loadingButton) return;
    setLoadingButton("done");
    router.push("/club");
  }, [loadingButton]);

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
              Register a wallet and add your bank for receiving payments. You&apos;ll have to
              provide some personal information to verify your identity and age.
            </Text>
            <Group gap={16} justify="space-between">
              <GlowingButton
                text={detailsSubmitted ? "Bank added" : "Add bank"}
                disabled={disableFirst || loadingButton === "bank"}
                loading={loadingButton === "bank"}
                onClick={openCountrySelectModal}
                containerStyles={{ flex: "unset" }}
              />
            </Group>
          </Stack>
          {submittedNotEnabled && (
            <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
              <Stack gap={8}>
                <Title order={5}>Verifying</Title>
                Your information is still being verified. Meanwhile you can explore the club. If you
                need to edit your information you can do it in the wallet.
                <RedirectToWalletButton />
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
              Sharing your data gives people a reason to follow you. You can always change your data
              sharing preferences in the settings.
            </Text>
            <DataSharingSwitches title="Data privacy" />
            <GlowingButton
              text="Done"
              disabled={disableSecond || loadingButton === "done"}
              loading={loadingButton === "done"}
              onClick={handleRedirect}
              containerStyles={{ alignSelf: "flex-start", marginTop: rem(4) }}
            />
          </Stack>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
