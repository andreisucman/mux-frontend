"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconPlus, IconSquareRoundedCheck } from "@tabler/icons-react";
import { Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { TypeEnum } from "@/types/global";
import { UserContext } from "../UserContext";
import SelectPartForRoutineModalContent from "./SelectPartForRoutineModalContent";

const defaultCreateRoutineContext = {
  isSubscriptionActive: false,
  isTrialUsed: false,
  onCreateRoutineClick: (...args: any) => {},
  isLoading: false,
};

export const CreateRoutineContext = createContext(defaultCreateRoutineContext);

export default function CreateRoutineProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { demographics } = userDetails || {};
  const { sex } = demographics || {};
  const type = searchParams.get("type") || "head";

  const { nextRoutine, nextScan, subscriptions } = userDetails || {};

  const { isSubscriptionActive, isTrialUsed } =
    checkSubscriptionActivity(["improvement", "peek"], subscriptions) || {};

  const refetchUserData = useCallback(async () => {
    const userData = await fetchUserData();
    setUserDetails(userData);
  }, [pathname]);

  async function handleCreateCheckoutSession() {
    createCheckoutSession({
      priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
      redirectPath: `/sort-concerns?type=${type}`,
      cancelPath: `/routines?type=${type}`,
      setUserDetails,
    });
  }

  function openSelectRoutineType(parts: { part: string; date: Date | null }[]) {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: <Title order={5} component={"p"}>Which routine to create?</Title>,
      innerProps: <SelectPartForRoutineModalContent type={type as TypeEnum} parts={parts} />,
    });
  }

  function onCreateRoutineClick(isSubscriptionActive: boolean, isTrialUsed: boolean) {
    if (isLoading) return;

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
      const buttonText = !!isTrialUsed ? "Add" : "Try free for 1 day";
      const buttonIcon = !!isTrialUsed ? (
        <IconPlus className="icon" />
      ) : (
        <IconSquareRoundedCheck className="icon" />
      );
      const coachIcon = sex === "male" ? "🦸‍♂️" : "🦸‍♀️";

      const onClick = !!isTrialUsed
        ? handleCreateCheckoutSession
        : () =>
            startSubscriptionTrial({
              subscriptionName: "improvement",
              cb: onCreateRoutineClick,
            });

      openSubscriptionModal({
        title: `${coachIcon} Add the Improvement Coach`,
        price: "3",
        isCentered: true,
        modalType: "improvement",
        buttonIcon,
        buttonText,
        color: "#99e2ff",
        underButtonText: "No credit card required",
        onClick,
        onClose: refetchUserData,
      });
    }
    setIsLoading(false);
  }

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
