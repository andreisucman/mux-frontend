import React from "react";
import { Group, rem, Stack, Text, Title } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./PricingCard.module.css";

type Props = {
  headerChildren?: React.ReactNode;
  addGradient?: boolean;
  price?: React.ReactNode;
  customContentStyles?: { [key: string]: any };
  customContainerStyles?: { [key: string]: any };
  customHeadingStyles?: { [key: string]: any };
  customPriceGroupStyles?: { [key: string]: any };
  name?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  buttonText?: string;
  isLoading?: boolean;
  underButtonText?: string;
  content: { icon: React.ReactNode; description: string }[];
  onClick?: (props?: any) => void;
};

export default function PricingCard({
  content,
  addGradient = false,
  customContentStyles,
  customHeadingStyles,
  customContainerStyles,
  description,
  icon,
  name,
  price,
  isLoading,
  headerChildren,
  underButtonText,
  buttonText,
  onClick,
}: Props) {
  return (
    <Stack className={classes.container} style={customContainerStyles || {}}>
      <Stack className={classes.heading} style={customHeadingStyles ? customHeadingStyles : {}}>
        {headerChildren}
        <Title order={4} className={classes.name}>
          {name}
        </Title>
        {price}
        <Text className={classes.description}>{description}</Text>
      </Stack>
      <Stack className={classes.content} style={customContentStyles || {}}>
        {content.map((item, index) => (
          <Group wrap="nowrap" key={index} gap={12}>
            {item.icon}
            {item.description}
          </Group>
        ))}
        {buttonText && (
          <>
            <GlowingButton
              icon={icon}
              text={buttonText}
              disabled={!price || isLoading}
              loading={isLoading}
              addGradient={addGradient}
              onClick={onClick}
              containerStyles={{ marginTop: rem(8) }}
            />
            {underButtonText && (
              <Text size="xs" c="dimmed" ta="center">
                {underButtonText}
              </Text>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
