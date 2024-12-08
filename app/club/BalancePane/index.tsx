import React, { memo, useCallback, useMemo } from "react";
import { IconDownload } from "@tabler/icons-react";
import { Group, Stack, Text, Title } from "@mantine/core";
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
        <Title order={2} className={classes.amount}>
          ${displayBalance}
        </Title>
      </Stack>
      <GlowingButton
        text={"Withdraw"}
        icon={<IconDownload className="icon" />}
        disabled={!balance || !payoutsEnabled}
        onClick={onWithdraw}
      />
    </Stack>
  );
}

export default memo(BalancePane);
