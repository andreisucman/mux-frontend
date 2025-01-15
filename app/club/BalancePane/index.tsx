import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, Button, Group, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import Link from "@/helpers/custom-router/patch-router/link";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { UserDataType } from "@/types/global";
import RedirectToWalletButton from "./RedirectToWalletButton";
import classes from "./BalancePane.module.css";

function BalancePane() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { club } = userDetails || {};
  const { payouts } = club || {};
  const { balance, payoutsEnabled, disabledReason, detailsSubmitted } = payouts || {};
  const submittedNotEnabled = detailsSubmitted && !payoutsEnabled;

  const onWithdraw = useCallback(async () => {
    if (isLoading || balance === 0 || !payoutsEnabled) return;

    setIsLoading(true);
    try {
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
        openSuccessModal({ description: response.message });

        setUserDetails((prev: UserDataType) => ({
          ...prev,
          club: { ...prev.club, payouts: { ...prev.club?.payouts, balance: 0 } },
        }));
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, balance, payoutsEnabled]);

  const displayBalance = useMemo(() => (balance ? balance?.toFixed(2) : 0), [balance]);

  const alert = useMemo(() => {
    if (!detailsSubmitted)
      return (
        <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
          <Group gap={8}>
            To enable withdrawals add your bank account or card.
            <Button component={Link} href="/club/admission" ml="auto" size="compact-sm">
              Add
            </Button>
          </Group>
        </Alert>
      );
    if (submittedNotEnabled)
      return (
        <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
          <Stack gap={8}>We're checking your information.</Stack>
        </Alert>
      );

    if (!payoutsEnabled && disabledReason)
      return (
        <Alert variant="light" icon={<IconInfoCircle className="icon" />}>
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
          disabled={!balance || !payoutsEnabled || isLoading}
          loading={isLoading}
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
