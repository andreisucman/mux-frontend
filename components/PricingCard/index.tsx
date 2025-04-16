import React from "react";
import cn from "classnames";
import { Group, Loader, rem, Stack, Text, Title } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./PricingCard.module.css";

type Props = {
  headerChildren?: React.ReactNode;
  addGradient?: boolean;
  price?: React.ReactNode;
  showFooter?: boolean;
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
  content: { icon: React.ReactNode; description: string }[];
  onClick?: (props?: any) => void;
};

export default function PricingCard({
  content,
  showFooter = true,
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
        className={`${classes.heading} gradient`}
        style={customHeadingStyles ? customHeadingStyles : {}}
      >
        {headerChildren}
        <Title order={4} className={classes.name} lineClamp={2}>
          {name}
        </Title>
        {price ? price : <Loader color="white" size="sm" m="auto" />}
        <Text className={classes.description} lineClamp={4}>
          {description}
        </Text>
      </Stack>
      <Stack className={classes.content} style={customContentStyles || {}}>
        <Stack className={classes.list}>
          {content.map((item, index) => (
            <Group wrap="nowrap" key={index} gap={12}>
              {item.icon}
              {item.description}
            </Group>
          ))}
        </Stack>

        {buttonText && (
          <Stack gap={12}>
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
      {showFooter && <Stack className={`${classes.footer} gradient`} />}
    </Stack>
  );
}
