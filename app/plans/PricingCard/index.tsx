import React from "react";
import cn from "classnames";
import { Group, rem, Stack, Text, Title } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./PricingCard.module.css";

type Props = {
  addGradient?: boolean;
  price?: React.ReactNode;
  customHeadingStyles?: { [key: string]: any };
  customPriceGroupStyles?: { [key: string]: any };
  name?: string | React.ReactNode;
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
  customHeadingStyles,
  icon,
  name,
  price,
  isLoading,
  underButtonText,
  buttonText,
  onClick,
}: Props) {
  return (
    <Stack className={classes.container}>
      <Stack
        className={cn(classes.heading, {
          [classes.premium]: !!price,
        })}
        style={customHeadingStyles ? customHeadingStyles : {}}
      >
        <Title order={4} className={classes.name}>
          {name}
        </Title>
        {price}
      </Stack>
      <Stack className={classes.content}>
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
              containerStyles={{ marginTop: rem(4) }}
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
