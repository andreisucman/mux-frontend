"use client";

import React, { useCallback, useContext, useState } from "react";
import { Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import createCheckoutSession from "@/functions/createCheckoutSession";
import openAuthModal from "@/helpers/openAuthModal";
import { ReferrerEnum } from "../auth/AuthForm/types";
import PricingCard from "./PricingCard";
import { freePlanContent, peekLicenseContent } from "./pricingData";
import classes from "./plans.module.css";

export const runtime = "edge";

export default function PlansPage() {
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId } = userDetails || {};

  const handleClickBuy = useCallback(() => {
    if (isLoading) return;

    if (status !== AuthStateEnum.AUTHENTICATED) {
      openAuthModal({
        title: "Sign in",
        stateObject: { referrer: ReferrerEnum.PLANS, localUserId: userId, redirectPath: "/plans" },
      });
    } else {
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/plans`;

      createCheckoutSession({
        priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
        cancelUrl: redirectUrl,
        redirectUrl: redirectUrl,
        setUserDetails,
      });
    }

    setIsLoading(false);
  }, [isLoading, status, userId]);

  return (
    <Stack className={classes.container}>
      <PageHeader title="Plans" hidePartDropdown hideTypeDropdown />
      <Group className={classes.content}>
        <PricingCard content={freePlanContent} name={"Free"} addGradient />
        <PricingCard
          content={peekLicenseContent}
          price={"19"}
          name={"Peek license"}
          isLoading={isLoading}
          onClick={handleClickBuy}
        />
      </Group>
    </Stack>
  );
}
