import React from "react";
import cn from "classnames";
import { Loader, rem, Stack, Text, Title } from "@mantine/core";
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
  glow?: boolean;
  underButtonText?: string;
  beforeButtonChild?: React.ReactNode;
  content?: React.ReactNode;
  onClick?: (props?: any) => void;
};

export default function PricingCard({
  content,
  addGradient = false,
  customContentStyles,
  customHeadingStyles,
  customContainerStyles,
  description,
  beforeButtonChild,
  icon,
  name,
  glow,
  price,
  isLoading,
  headerChildren,
  underButtonText,
  buttonText,
  onClick,
}: Props) {
  return (
    <Stack
      className={cn(classes.container, { [classes.glow]: glow })}
      style={customContainerStyles || {}}
    >
      <Stack
        className={cn(classes.heading, "gradient")}
        style={customHeadingStyles ? customHeadingStyles : {}}
      >
        {headerChildren}
        <Title order={4} className={classes.name} lineClamp={2}>
          {name}
        </Title>
        {price ? (
          price
        ) : (
          <Loader
            size="sm"
            m="auto"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
        <Text className={classes.description} lineClamp={4}>
          {description}
        </Text>
      </Stack>
      <Stack className={classes.content} style={customContentStyles || {}}>
        {content}

        {buttonText && (
          <Stack gap={12} mb={4}>
            {beforeButtonChild}
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
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
