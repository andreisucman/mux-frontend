import React, { useEffect, useState } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";
import PricingCard from "@/components/PricingCard";
import { updateContent } from "@/data/pricingData";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./SubscribeToUpdatesModalContent.module.css";

type Props = { sellerId: string; part: string };

export default function SubscribeToUpdatesModalContent({ sellerId, part }: Props) {
  const [price, setPrice] = useState<React.ReactNode>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callTheServer({
      endpoint: `getSubscriptionPrice?sellerId=${sellerId}&part=${part}`,
      method: "GET",
    }).then((res) => {
      if (res.status === 200) {
        setPrice(
          <Group align="center" gap={4}>
            <Title order={4} component="div">
              ${res.message}
            </Title>
            /<Text fw={600}>month</Text>
          </Group>
        );
      }
    });
  }, []);

  const onSubscribeClick = async (sellerId: string, part: string) => {
    setIsLoading(true);
    const response = await callTheServer({
      endpoint: "subscribeToUpdates",
      method: "POST",
      body: { sellerId, part },
    });

    if (response.status === 200) {
      if (response.error) {
        setIsLoading(false);
        openErrorModal({ description: response.error });
        return;
      }
      const { redirectUrl } = response.message;
      location.replace(redirectUrl);
    }
  };

  return (
    <Stack className={classes.container}>
      <PricingCard
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
