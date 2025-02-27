"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import { useRouter } from "@/helpers/custom-router";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
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
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  const { nextRoutine, nextScan, subscriptions } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } =
    checkSubscriptionActivity(["improvement", "peek"], subscriptions) || {};

  const handleCreateCheckoutSession = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/sort-concerns`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}`;

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
      innerProps: <SelectPartForRoutineModalContent parts={parts} />,
    });
  };

  const onCreateRoutineClick = ({
    isSubscriptionActive,
    isTrialUsed,
  }: OnCreateRoutineClickProps) => {
    if (isLoading) return;

    if (isSubscriptionActive) {
      const partsScanned = nextScan?.filter((obj) => Boolean(obj.date));

      if (partsScanned && partsScanned.length > 0) {
        const scannedPartKeys = partsScanned.map((obj) => obj.part);
        const relevantRoutines = nextRoutine?.filter((obj) => scannedPartKeys.includes(obj.part));

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
              router,
            });

      openSubscriptionModal({
        title: "Add the improvement coach",
        price: "5",
        isCentered: true,
        modalType: "improvement",
        buttonText,
        underButtonText: isTrialUsed ? "" : "No credit card required",
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
