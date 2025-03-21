import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, Button, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { UserDataType } from "@/types/global";
import RedirectToWalletButton from "./RedirectToWalletButton";
import classes from "./BalancePane.module.css";

function BalancePane() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  const { club, country } = userDetails || {};
  const { payouts } = club || {};
  const { balance, payoutsEnabled, disabledReason, detailsSubmitted } = payouts || {};
  const submittedNotEnabled = detailsSubmitted && !payoutsEnabled;

  const openCountrySelectModal = useCallback(() => {
    setLoadingButton("add");
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
      setLoadingButton(null);
      return;
    }

    handleCreateConnectAccount();
  }, [country]);

  const handleSetCountryAndCreateAccount = async (newCountry: string) => {
    setLoadingButton("add");
    const response = await callTheServer({
      endpoint: "changeCountry",
      method: "POST",
      body: { newCountry },
    });

    if (response.status === 200) {
      const { defaultClubPayoutData } = response.message;
      setUserDetails((prev: UserDataType) => ({
        ...prev,
        country: newCountry,
        club: { ...prev.club, payouts: defaultClubPayoutData },
      }));

      handleCreateConnectAccount();
      modals.closeAll();
    }

    setLoadingButton(null);
  };

  const handleCreateConnectAccount = async () => {
    setLoadingButton("bank");
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

    setLoadingButton(null);
  };

  const onWithdraw = async () => {
    if (loadingButton || balance === 0 || !payoutsEnabled) return;

    setLoadingButton("withdraw");
    const response = await callTheServer({
      endpoint: "withdrawReward",
      method: "POST",
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({
          description: response.error,
        });
        return;
      }
      openInfoModal({ title: "✔️ Success!", description: response.message });

      setUserDetails((prev: UserDataType) => ({
        ...prev,
        club: { ...prev.club, payouts: { ...prev.club?.payouts, balance: 0 } },
      }));
    } else {
      setLoadingButton(null);
      openErrorModal();
    }
  };

  const displayBalance = useMemo(() => (balance ? balance?.toFixed(2) : 0), [balance]);

  const alert = useMemo(() => {
    if (!detailsSubmitted)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Group gap={8}>
            Your seller's profile is inactive. To activate it add your bank account.
            <Button ml="auto" size="compact-sm" onClick={openCountrySelectModal}>
              Add
            </Button>
          </Group>
        </Alert>
      );
    if (submittedNotEnabled)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Stack gap={8}>We're checking your information.</Stack>
        </Alert>
      );

    if (!payoutsEnabled && disabledReason)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Stack gap={8}>
            Your payouts have been disabled. Sign in to your wallet to fix that.
          </Stack>
        </Alert>
      );
  }, [detailsSubmitted, payoutsEnabled, disabledReason]);

  return (
    <Stack className={classes.container}>
      <Group className={classes.row}>
        <Text c="dimmed" size="sm">
          Your earnings
        </Text>
        {detailsSubmitted && <RedirectToWalletButton variant="default" />}
      </Group>
      {alert && <Stack>{alert}</Stack>}
      <Stack className={classes.stack}>
        <Title order={2} className={classes.amount}>
          ${displayBalance}
        </Title>
        <Button
          disabled={!balance || !payoutsEnabled || loadingButton === "withdraw"}
          loading={loadingButton === "withdraw"}
          onClick={onWithdraw}
          size="compact-sm"
        >
          Withdraw
        </Button>
      </Stack>
    </Stack>
  );
}

export default memo(BalancePane);
