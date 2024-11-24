import React, { useState } from "react";
import { Group, rem, Stack, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./PricingCard.module.css";

type Props = {
  addGradient?: boolean;
  price?: string;
  customHeadingStyles?: { [key: string]: any };
  customPriceGroupStyles?: { [key: string]: any };
  name?: string | React.ReactNode;
  icon?: React.ReactNode;
  buttonText: string;
  underButtonText?: string;
  onClick: (args?: any) => Promise<void> | void;
  content: { icon: React.ReactNode; description: string }[];
};

export default function PricingCard({
  content,
  addGradient = false,
  customHeadingStyles,
  customPriceGroupStyles,
  icon,
  name,
  price,
  underButtonText,
  buttonText,
  onClick,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    await onClick();

    const tId = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(tId);
    }, 4000);
  }

  return (
    <Stack className={classes.container}>
      <Stack className={classes.heading} style={customHeadingStyles ? customHeadingStyles : {}}>
        {name}
        <>
          {price && (
            <Group
              className={classes.priceGroup}
              style={customPriceGroupStyles ? customPriceGroupStyles : {}}
            >
              <Text fw={600} fz={22} component="div">
                ${price}
              </Text>
              /{" "}
              <Text size="sm" mt={rem(2)}>
                month
              </Text>
            </Group>
          )}
        </>
      </Stack>
      <Stack className={classes.content}>
        {content.map((item, index) => (
          <Group wrap="nowrap" key={index} gap={12}>
            {item.icon}
            {item.description}
          </Group>
        ))}

        <GlowingButton
          icon={icon}
          text={buttonText}
          disabled={!price}
          addGradient={addGradient}
          loading={isLoading}
          onClick={handleClick}
          containerStyles={{ marginTop: rem(4) }}
        />
        {underButtonText && (
          <Text size="xs" c="dimmed" ta="center">
            {underButtonText}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
