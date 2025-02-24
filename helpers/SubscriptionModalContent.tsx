import React, { useState } from "react";
import { Stack, Text } from "@mantine/core";
import PricingCard from "@/app/plans/PricingCard";

type Props = {
  description?: string;
  name: React.ReactNode;
  price?: string;
  content: { icon: React.ReactNode; description: string }[];
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  underButtonText?: string;
  onClick: () => void;
};

export default function SubscriptionModalContent({
  description,
  name,
  price,
  content,
  buttonIcon,
  buttonText,
  underButtonText,
  onClick,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    await Promise.race([onClick(), new Promise((resolve) => setTimeout(resolve, 15000))]);

    setIsLoading(false);
  };

  return (
    <Stack flex={1}>
      {description && <Text size="sm">{description}</Text>}
      <PricingCard
        name={name}
        price={price}
        addGradient={true}
        isLoading={isLoading}
        content={content}
        icon={buttonIcon}
        buttonText={buttonText}
        underButtonText={underButtonText}
        customHeadingStyles={{
          borderRadius: 0,
        }}
        onClick={handleClick}
      />
    </Stack>
  );
}
