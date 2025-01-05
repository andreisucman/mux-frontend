"use client";

import React from "react";
import { Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import PricingCard from "@/app/plans/PricingCard";
import {
  advisorCoachContent,
  analystCoachContent,
  improvementCoachContent,
  peekLicenseContent,
} from "@/app/plans/pricingData";

type Props = {
  modalType: "improvement" | "advisor" | "analyst" | "peek";
  title: string;
  name?: string;
  price?: string;
  withCloseButton?: boolean;
  description?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  underButtonText?: string;
  isCentered?: boolean;
  onClick: (args?: any) => Promise<void>;
  onClose: (args?: any) => void;
};

export default function openSubscriptionModal({
  title,
  modalType,
  price,
  name,
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
      : modalType === "advisor"
        ? advisorCoachContent
        : modalType === "peek"
          ? peekLicenseContent
          : analystCoachContent;

  modals.openContextModal({
    modal: "general",
    centered: isCentered,
    withCloseButton,
    closeOnClickOutside: withCloseButton,
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
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
            borderRadius: 0,
          }}
          onClick={onClick}
        />
      </Stack>
    ),
    onClose,
  });
}
