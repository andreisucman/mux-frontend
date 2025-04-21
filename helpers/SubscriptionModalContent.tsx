import React, { useState } from "react";
import { Group, Stack, Text } from "@mantine/core";
import PricingCard from "@/components/PricingCard";

type Props = {
  description?: string;
  name: React.ReactNode;
  price?: React.ReactNode;
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

  const jsx = (
    <Stack>
      {content.map((item, index) => (
        <Group wrap="nowrap" key={index} gap={12}>
          {item.icon}
          {item.description}
        </Group>
      ))}
    </Stack>
  );

  return (
    <Stack flex={1}>
      {description && <Text size="sm">{description}</Text>}
      <PricingCard
        name={name}
        price={price}
        addGradient={true}
        isLoading={isLoading}
        content={jsx}
        icon={buttonIcon}
        buttonText={buttonText}
        underButtonText={underButtonText}
        onClick={handleClick}
      />
    </Stack>
  );
}
