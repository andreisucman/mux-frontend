"use client";

import React, { useContext, useState } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectComponentsProvider, ConnectPayouts } from "@stripe/react-connect-js";
import cn from "classnames";
import { Skeleton, Stack } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { makeStripeAppearance } from "@/functions/makeStripeAppearance";
import classes from "./wallet.module.css";

export default function Wallet() {
  const { userDetails } = useContext(UserContext);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const colorScheme = useColorScheme(undefined, { getInitialValueInEffect: false });
  const [stripeConnectInstance] = useState(() => {
    const fetchClientSecret = async () => {
      const response = await callTheServer({ endpoint: "getPayouts", method: "GET" });

      if (response.status === 200) {
        return response.message;
      }
    };

    return loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret: fetchClientSecret,
      appearance: makeStripeAppearance(colorScheme === "dark"),
    });
  });

  const { club } = userDetails || {};
  const { payouts } = club || {};
  const { connectId } = payouts || {};

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Wallet" />
      {connectId && (
        <Skeleton className="skeleton" visible={balanceLoading}>
          <Stack className={classes.wrapper}>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectPayouts onLoaderStart={() => setBalanceLoading(false)} />
            </ConnectComponentsProvider>
          </Stack>
        </Skeleton>
      )}
    </Stack>
  );
}
