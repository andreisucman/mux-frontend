"use client";

import React, { createContext, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCirclePlus, IconSquareRoundedCheck } from "@tabler/icons-react";
import { rem, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { TypeEnum } from "@/types/global";
import { UserContext } from "../UserContext";
import SelectPartForRoutineModalContent from "./SelectPartForRoutineModalContent";

export type OnCreateRoutineClickProps = {
  isSubscriptionActive: boolean;
  isTrialUsed: boolean;
};

const defaultCreateRoutineContext = {
  isSubscriptionActive: false,
  isTrialUsed: false,
  onCreateRoutineClick: (args: OnCreateRoutineClickProps) => {},
  isLoading: false,
};

export const CreateRoutineContext = createContext(defaultCreateRoutineContext);

export default function CreateRoutineProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  const type = searchParams.get("type") || "head";

  const { nextRoutine, nextScan, subscriptions } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } =
    checkSubscriptionActivity(["improvement", "peek"], subscriptions) || {};

  const handleCreateCheckoutSession = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/sort-concerns?${searchParams.toString()}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/tasks?${searchParams.toString()}`;

    createCheckoutSession({
      priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
      redirectUrl,
      cancelUrl,
      setUserDetails,
    });
  };

  const openSelectRoutineType = (parts: { part: string; date: Date | null }[]) => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          Which routine to create?
        </Title>
      ),
      innerProps: <SelectPartForRoutineModalContent type={type as TypeEnum} parts={parts} />,
    });
  };

  const onCreateRoutineClick = ({
    isSubscriptionActive,
    isTrialUsed,
  }: OnCreateRoutineClickProps) => {
    if (isLoading) return;
    console.log("isTrialUsed", isTrialUsed);

    if (isSubscriptionActive) {
      const typeNextScan = nextScan?.find((obj) => obj.type === type);
      const partsScanned = typeNextScan?.parts.filter((obj) => Boolean(obj.date));

      if (partsScanned && partsScanned.length > 1) {
        const typeNextRoutine = nextRoutine?.find((obj) => obj.type === type);
        const scannedPartKeys = partsScanned.map((obj) => obj.part);
        const relevantRoutines = typeNextRoutine?.parts.filter((obj) =>
          scannedPartKeys.includes(obj.part)
        );
        if (relevantRoutines) openSelectRoutineType(relevantRoutines);
      }
    } else {
      const buttonText = !!isTrialUsed ? "Add coach" : "Try free for 1 day";

      const onClick = !!isTrialUsed
        ? handleCreateCheckoutSession
        : () =>
            startSubscriptionTrial({
              subscriptionName: "improvement",
              onComplete: onCreateRoutineClick,
            });

      openSubscriptionModal({
        title: "Add the improvement coach",
        price: "4",
        isCentered: true,
        modalType: "improvement",
        buttonText,
        underButtonText: "No credit card required",
        onClick,
        onClose: () => fetchUserData({ setUserDetails }),
      });
    }
    setIsLoading(false);
  };

  return (
    <CreateRoutineContext.Provider
      value={{
        isSubscriptionActive: !!isSubscriptionActive,
        isTrialUsed: !!isTrialUsed,
        isLoading,
        onCreateRoutineClick,
      }}
    >
      {children}
    </CreateRoutineContext.Provider>
  );
}
