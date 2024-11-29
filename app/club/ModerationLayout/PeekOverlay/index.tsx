import React, { useContext } from "react";
import { Stack, Text } from "@mantine/core";
import PricingCard from "@/app/plans/PricingCard";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import { peekLicenseContent } from "@/app/plans/pricingData";
import classes from "./PeekOverlay.module.css";

type Props = {
  description: string;
};

export default function PeekOverlay({ description }: Props) {
  const { setUserDetails } = useContext(UserContext);

  return (
    <Stack className={classes.container}>
      <Text className={classes.text} size="sm">
        {description}
      </Text>
      <PricingCard
        buttonText="Add"
        content={peekLicenseContent}
        onClick={() =>
          createCheckoutSession({
            priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
            redirectPath: `${location.pathname}/${location.search}`,
            cancelPath: `${location.pathname}/${location.search}`,
            setUserDetails,
          })
        }
        price="19"
        name={"Peek License"}
        addGradient
      />
    </Stack>
  );
}
