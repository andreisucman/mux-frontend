"use client";

import React from "react";
import { Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import PricingCard from "@/app/plans/PricingCard";
import {
  analystCoachContent,
  guruCoachContent,
  improvementCoachContent,
  peekLicenseContent,
} from "@/app/plans/pricingData";

type Props = {
  modalType: "improvement" | "guru" | "analyst" | "peek";
  title: string;
  name?: string;
  price?: string;
  color: string;
  withCloseButton?: boolean;
  description?: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  underButtonText?: string;
  isCentered?: boolean;
  onClick: (args?: any) => void;
  onClose: (args?: any) => void;
};

export default function openSubscriptionModal({
  title,
  modalType,
  price,
  name,
  color,
  description,
  buttonText,
  buttonIcon,
  underButtonText,
  isCentered,
  withCloseButton = true,
  onClick,
  onClose,
}: Props) {
  const content =
    modalType === "improvement"
      ? improvementCoachContent
      : modalType === "guru"
        ? guruCoachContent
        : modalType === "peek"
          ? peekLicenseContent
          : analystCoachContent;

  modals.openContextModal({
    modal: "general",
    centered: isCentered,
    withCloseButton,
    closeOnClickOutside: withCloseButton,
    title: <Text fw={600}>{title}</Text>,
    innerProps: (
      <Stack flex={1}>
        {description && <Text size="sm">{description}</Text>}
        <PricingCard
          name={name}
          price={price}
          addGradient={true}
          content={content}
          icon={buttonIcon}
          buttonText={buttonText}
          underButtonText={underButtonText}
          customHeadingStyles={{
            backgroundColor: color,
            borderRadius: 0,
          }}
          customPriceGroupStyles={{ color: "#262626" }}
          onClick={onClick}
        />
      </Stack>
    ),
    onClose,
  });
}
