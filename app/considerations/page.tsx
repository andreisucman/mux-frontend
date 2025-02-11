"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import TextareaComponent from "@/components/TextAreaComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { useRouter } from "@/helpers/custom-router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { UserConcernType, UserDataType, UserSubscriptionsType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import classes from "./considerations.module.css";

export const runtime = "edge";

type CreateRoutineProps = {
  concerns?: UserConcernType[];
  subscriptions?: UserSubscriptionsType;
  specialConsiderations: string;
};

export default function Considerations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);

  const { demographics, specialConsiderations } = userDetails || {};
  const { sex } = demographics || {};

  const part = searchParams.get("part");

  const placeholder =
    sex === "female"
      ? "(Optional) Vegetarian, pregnancy, diabetes, allergy, etc..."
      : "(Optional) Vegetarian, diabetes, allergy, surgery, etc...";

  const handleCreateRoutine = () => {
    updateSpecialConsiderations(text);
    const { concerns, subscriptions } = userDetails || {};
    createRoutine({ concerns, subscriptions, specialConsiderations: text });
  };

  const updateSpecialConsiderations = useCallback(
    async (text: string) => {
      try {
        if (status === "authenticated") {
          const response = await callTheServer({
            endpoint: "updateSpecialConsiderations",
            method: "POST",
            body: { text },
          });
          if (response.status === 200) {
            setUserDetails((prev: UserDataType) => ({ ...prev, specialConsiderations: text }));
          }
        } else {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            specialConsiderations: text,
          }));
        }
      } catch (err) {}
    },
    [userDetails]
  );

  const createRoutine = useCallback(
    async ({ concerns, subscriptions, specialConsiderations }: CreateRoutineProps) => {
      if (isLoading || !concerns || !subscriptions) return;
      setIsLoading(true);

      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/tasks?${searchParams.toString()}`;

      try {
        const response = await callTheServer({
          endpoint: "createRoutine",
          method: "POST",
          body: {
            part,
            concerns,
            specialConsiderations,
          },
        });

        if (response.status === 200) {
          if (response.error === "subscription expired") {
            const { improvement } = subscriptions || {};
            const { isTrialUsed } = improvement || {};

            const buttonText = !!isTrialUsed ? "Add coach" : "Try free for 1 day";

            const onClick = !!isTrialUsed
              ? async () =>
                  createCheckoutSession({
                    priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
                    redirectUrl,
                    cancelUrl: redirectUrl,
                    setUserDetails,
                  })
              : () =>
                  startSubscriptionTrial({
                    subscriptionName: "improvement",
                  });

            openSubscriptionModal({
              title: `Add the improvement coach`,
              price: "4",
              isCentered: true,
              modalType: "improvement",
              underButtonText: isTrialUsed ? "" : "No credit card required",
              buttonText,
              onClick,
              onClose: () => fetchUserData({ setUserDetails }),
            });

            return;
          }
          saveToLocalStorage("runningAnalyses", { routine: true }, "add");
          router.replace(redirectUrl);
        }
      } catch (err) {
        setIsLoading(false);
      }
    },
    [part, isLoading, userDetails]
  );

  useEffect(() => {
    if (!specialConsiderations) return;

    setText(specialConsiderations || "");
  }, [specialConsiderations]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn title="Special considerations" showReturn />
        <InstructionContainer
          title="Instructions"
          instruction={"Add any special considerations or preferences you have."}
          description="Your routine will be adapted to them."
          customStyles={{ flex: 0 }}
        />
        <Stack className={classes.wrapper}>
          <TextareaComponent text={text} placeholder={placeholder} setText={setText} />

          <Button loading={isLoading} onClick={handleCreateRoutine} disabled={isLoading}>
            Next
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
