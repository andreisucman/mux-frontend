"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import addImprovementCoach from "@/helpers/addImprovementCoach";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
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
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  const { nextRoutine, latestProgressImages, subscriptions } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } =
    checkSubscriptionActivity(["improvement"], subscriptions) || {};

  const openSelectRoutineType = (parts: { part: string; date: Date | null }[]) => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      classNames: { overlay: "overlay" },
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
    if (!nextRoutine) return;

    if (isSubscriptionActive) {
      const partsScanned = Object.entries(latestProgressImages || {})
        .filter(([key, value]) => Boolean(value))
        .map(([key, _]) => key);

      if (partsScanned.length > 0) {
        const relevantRoutines = nextRoutine.filter((obj) => partsScanned.includes(obj.part));
        if (relevantRoutines) openSelectRoutineType(relevantRoutines);
      }
    } else {
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/add-details`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}`;

      addImprovementCoach({
        improvementSubscription: subscriptions?.improvement,
        onComplete: () => onCreateRoutineClick({ isSubscriptionActive: true, isTrialUsed }),
        redirectUrl,
        cancelUrl,
        setUserDetails,
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
