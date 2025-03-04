"use client";

import React from "react";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  advisorCoachContent,
  improvementCoachContent,
  peekLicenseContent,
  scanAnalysisContent,
} from "@/app/plans/pricingData";
import SubscriptionModalContent from "./SubscriptionModalContent";

type Props = {
  modalType: "improvement" | "advisor" | "peek" | "scan";
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

export default function openPaymentModal({
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
  let content: any[] = improvementCoachContent;

  switch (modalType) {
    case "improvement":
      content = improvementCoachContent;
      break;
    case "advisor":
      content = advisorCoachContent;
      break;
    case "peek":
      content = peekLicenseContent;
      break;
    case "scan":
      content = scanAnalysisContent;
      break;
  }

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
      <SubscriptionModalContent
        name={name}
        price={price}
        content={content}
        buttonIcon={buttonIcon}
        buttonText={buttonText}
        underButtonText={underButtonText}
        description={description}
        onClick={onClick}
      />
    ),
    onClose,
  });
}
