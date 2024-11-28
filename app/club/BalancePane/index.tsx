import React, { memo, useCallback, useMemo } from "react";
import { Group, Stack, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import RedirectToWalletButton from "./RedirectToWalletButton";
import classes from "./BalancePane.module.css";

type Props = {
  balance?: number;
  payoutsEnabled?: boolean;
};

function BalancePane({ balance, payoutsEnabled }: Props) {
  const onWithdraw = useCallback(async () => {
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
      }
    } catch (err) {
      console.log("Error in onWithdraw: ", err);
    }
  }, []);

  const displayBalance = useMemo(() => (balance ? balance?.toFixed(2) : 0), [balance]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.stack}>
        <Group className={classes.row}>
          <Text c="dimmed" size="sm">
            Your earnings
          </Text>
          <RedirectToWalletButton />
        </Group>
        <Text className={classes.amount}>${displayBalance}</Text>
      </Stack>
      <GlowingButton
        text={"Withdraw"}
        disabled={!balance || !payoutsEnabled}
        onClick={onWithdraw}
      />
    </Stack>
  );
}

export default memo(BalancePane);
