"use client";

import React from "react";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { routineSuggestionContent, scanAnalysisContent } from "@/data/pricingData";
import SubscriptionModalContent from "./SubscriptionModalContent";

type Props = {
  modalType: "suggestion" | "scan";
  title: string;
  name?: string;
  price?: React.ReactNode;
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
  let content: any[] = routineSuggestionContent;

  switch (modalType) {
    case "suggestion":
      content = routineSuggestionContent;
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
    classNames: { overlay: "overlay" },
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
