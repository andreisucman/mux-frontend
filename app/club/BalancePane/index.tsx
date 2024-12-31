import React, { memo, useCallback, useContext, useMemo, useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import { Button, Group, rem, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
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
  const { balance, payoutsEnabled } = payouts || {};

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

  return (
    <Stack className={classes.container}>
      <Stack className={classes.stack}>
        <Group className={classes.row}>
          <Text c="dimmed" size="sm">
            Your earnings
          </Text>
          <RedirectToWalletButton variant="default" />
        </Group>
        <Title order={2} className={classes.amount}>
          ${displayBalance}
        </Title>
        <Button
          disabled={!balance || !payoutsEnabled || isLoading}
          loading={isLoading}
          onClick={onWithdraw}
          size="compact-sm"
        >
          <IconDownload className="icon" style={{ marginRight: rem(6) }} />
          Withdraw
        </Button>
      </Stack>
    </Stack>
  );
}

export default memo(BalancePane);
