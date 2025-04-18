import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconRotate } from "@tabler/icons-react";
import { Group, rem, Stack, Text, Title } from "@mantine/core";
import PricingCard from "@/components/PricingCard";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./SubscribeToUpdatesModalContent.module.css";

type Props = { sellerId: string; sellerName: string; part: string };

export default function SubscribeToUpdatesModalContent({ sellerId, sellerName, part }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<React.ReactNode>();
  const [isLoading, setIsLoading] = useState(false);

  const updateContent = [
    {
      icon: (
        <IconRotate
          className="icon icon__large"
          style={{ minWidth: rem(20), minHeight: rem(20) }}
        />
      ),
      description: `See the latest routines, progress, diary, and proofs as ${sellerName} uploads them.`,
    },
  ];

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
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    setIsLoading(true);
    const response = await callTheServer({
      endpoint: "subscribeToUpdates",
      method: "POST",
      body: { sellerId, part, redirectUrl, cancelUrl: redirectUrl },
    });

    if (response.status === 200) {
      if (response.error) {
        setIsLoading(false);
        openErrorModal({ description: response.error });
        return;
      }
      location.replace(response.message.redirectUrl);
    } else {
      openErrorModal();
      setIsLoading(false);
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
   
        onClick={() => onSubscribeClick(sellerId, part)}
      />
    </Stack>
  );
}
