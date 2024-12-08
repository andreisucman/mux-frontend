import React, { useCallback } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import classes from "./BalancePane.module.css";

export default function RedirectToWalletButton() {
  const router = useRouter();

  const redirectToWallet = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "redirectToWallet",
        method: "POST",
        body: { redirectUrl: window.location.href },
      });

      if (response.status === 200) {
        router.push(response.message);
      }
    } catch (err) {
      console.log("Error in redirectToWallet: ", err);
    }
  }, []);

  return (
    <Button
      variant="default"
      size="compact-sm"
      className={classes.redirectToWalletButton}
      onClick={redirectToWallet}
    >
      Wallet
      <IconArrowUpRight className="icon icon__small" />
    </Button>
  );
}
