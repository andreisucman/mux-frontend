import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Alert, Button, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SelectCountry from "@/components/SelectCountry";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import classes from "./BalancePane.module.css";

function BalancePane() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpenTooltip(false));

  const { club, country } = userDetails || {};
  const { payouts } = club || {};
  const { balance, payoutsEnabled, disabledReason, detailsSubmitted, connectId } = payouts || {};

  const openCountrySelectModal = useCallback(() => {
    setIsLoading(true);
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
      setIsLoading(false);
      return;
    }

    handleCreateConnectAccount();
  }, [country]);

  const handleSetCountryAndCreateAccount = useCallback(async (newCountry: string) => {
    setIsLoading(true);

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
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleCreateConnectAccount = useCallback(async () => {
    setIsLoading(true);
    const response = await callTheServer({
      endpoint: "createConnectAccount",
      method: "POST",
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        setUserDetails((prev: UserDataType) => ({ ...prev, country: null }));
        setIsLoading(false);
        return;
      }
      router.push(response.message);
    } else {
      openErrorModal({ description: response.error });
      setIsLoading(false);
    }
  }, []);

  const displayBalance = useMemo(() => {
    const { pending, available } = balance || {};
    const pendingAmount = (pending?.amount || 0) / 100;
    const availableAmount = (available?.amount || 0) / 100;
    const pendingCurrency = pending?.currency.toUpperCase() || "USD";
    const availableCurrency = available?.currency.toUpperCase() || "USD";

    return (
      <Group className={classes.balance}>
        <Group className={classes.section}>
          <Text className={classes.annotation} c="dimmed">
            Pending
          </Text>
          <Title c="dimmed" order={2} className={classes.pending}>
            {pendingAmount}
            <Text c="dimmed" className={classes.currency}>
              {pendingCurrency}
            </Text>
          </Title>
        </Group>
        <Group className={classes.section}>
          <Text className={classes.annotation} c="dimmed" style={{ right: 0, left: "unset" }}>
            Available
          </Text>
          <Title order={2} className={classes.available}>
            {availableAmount}
            <Text className={classes.currency}>{availableCurrency}</Text>
          </Title>
        </Group>
      </Group>
    );
  }, [isLoading, balance]);

  const alert = useMemo(() => {
    const submittedNotEnabled = detailsSubmitted && !payoutsEnabled && !disabledReason;
    const isRejected = disabledReason === "rejected.other";

    if (!detailsSubmitted)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Group gap={8}>
            Your withdrawals are inactive. To activate them add a bank account.
            <Button
              loading={isLoading}
              disabled={isLoading}
              ml="auto"
              size="compact-sm"
              onClick={openCountrySelectModal}
            >
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

    if (isRejected)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Stack gap={8}>
            Sorry, but we can't support your payments. Reach out to info@muxout.com if you have
            questions.
          </Stack>
        </Alert>
      );

    if (!payoutsEnabled && disabledReason)
      return (
        <Alert
          variant="light"
          classNames={{ icon: classes.alertIcon }}
          icon={<IconInfoCircle className="icon" />}
        >
          <Stack gap={8}>Your payouts have been disabled. Check your wallet for more info.</Stack>
        </Alert>
      );
  }, [isLoading, detailsSubmitted, payoutsEnabled, disabledReason]);

  const redirectToWallet = useCallback(async () => {
    const response = await callTheServer({
      endpoint: "redirectToWallet",
      method: "POST",
      body: { redirectUrl: window.location.href },
    });

    if (response.status === 200) {
      location.href = response.message;
    }
  }, []);

  return (
    <Stack className={classes.container}>
      <Group className={classes.header}>
        <Text c="dimmed" size="sm">
          Your balance
        </Text>
        <Group gap={8}>
          <Tooltip
            opened={openTooltip}
            label="Manage your bank accounts, payout schedule and see the status of your payouts in the wallet."
            ref={clickOutsideRef}
            onClick={() => setOpenTooltip((prev) => !prev)}
            multiline
          >
            <ActionIcon variant="default">
              <IconInfoCircle className="icon icon__small" />
            </ActionIcon>
          </Tooltip>
          <Button
            variant={"default"}
            size="compact-sm"
            disabled={!connectId}
            style={{ position: "relative", zIndex: 1 }}
            onClick={redirectToWallet}
          >
            Go to wallet
          </Button>
        </Group>
      </Group>
      {alert && <Stack>{alert}</Stack>}
      <Stack className={classes.stack}>{displayBalance}</Stack>
    </Stack>
  );
}

export default memo(BalancePane);
