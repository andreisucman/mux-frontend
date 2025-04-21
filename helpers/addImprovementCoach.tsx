import React from "react";
import { Group, Text, Title } from "@mantine/core";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { SubscriptionType, UserDataType } from "@/types/global";
import openPaymentModal from "./openPaymentModal";

type Props = {
  improvementSubscription?: SubscriptionType;
  redirectUrl: string;
  cancelUrl: string;
  onComplete: () => void;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType | null>>>;
};
export default function addImprovementCoach({
  redirectUrl,
  cancelUrl,
  improvementSubscription,
  onComplete,
  setUserDetails,
}: Props) {
  const { isTrialUsed } = improvementSubscription || {};

  const buttonText = !!isTrialUsed ? "Add coach" : "Try free for one week";

  const onClick = !!isTrialUsed
    ? async () =>
        createCheckoutSession({
          body: {
            priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
            redirectUrl,
            cancelUrl,
            mode: "subscription",
          },
          type: "platform",
          setUserDetails,
        })
    : () =>
        startSubscriptionTrial({
          subscriptionName: "improvement",
          onComplete,
        });

  openPaymentModal({
    title: `Add the improvement coach`,
    price: (
      <Group className="priceGroup">
        <Title order={4}>$5</Title>/ <Text>month</Text>
      </Group>
    ),
    isCentered: true,
    modalType: "improvement",
    underButtonText: isTrialUsed ? "" : "No credit card required",
    buttonText,
    onClick,
    onClose: () => fetchUserData({ setUserDetails }),
  });
}
