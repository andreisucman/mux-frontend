import React from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import classes from "./BalancePane.module.css";

export default function RedirectToWalletButton() {
  async function redirectToWallet() {
    try {
      const response = await callTheServer({
        endpoint: "redirectToWallet",
        method: "POST",
        body: { redirectUrl: window.location.href },
      });

      if (response.status === 200) {
        window.location.href = response.message;
      }
    } catch (err) {
      console.log("Error in redirectToWallet: ", err);
    }
  }

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
