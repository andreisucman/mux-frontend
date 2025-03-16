import React, { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import PricingCard from "@/components/PricingCard";
import { updateContent } from "@/data/pricingData";
import callTheServer from "@/functions/callTheServer";
import classes from "./SubscribeToUpdatesModalContent.module.css";

type Props = { sellerId: string; part: string };

export default function SubscribeToUpdatesModalContent({ sellerId, part }: Props) {
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    callTheServer({
      endpoint: `getSubscriptionPrice?sellerId=${sellerId}&part=${part}`,
      method: "GET",
    }).then((res) => {
      if (res.status === 200) {
        setIsLoading(false);
        setPrice(res.message);
      }
    });
  }, []);

  const onSubscribeClick = async (sellerId: string, part: string) => {
    const response = await callTheServer({
      endpoint: "subscribeToUpdates",
      method: "POST",
      body: { sellerId, part },
    });

    if (response.status === 200) {
      const { redirectUrl } = response.message;
      location.replace(redirectUrl);
    }
  };

  return (
    <Stack className={classes.container}>
      <PricingCard
        name={"Subscribe to updates"}
        price={price}
        addGradient={true}
        isLoading={isLoading}
        content={updateContent}
        buttonText={"Subscribe"}
        customHeadingStyles={{
          borderRadius: 0,
        }}
        onClick={() => onSubscribeClick(sellerId, part)}
      />
    </Stack>
  );
}
