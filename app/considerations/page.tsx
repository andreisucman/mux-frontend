"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/helpers/custom-router";
import { IconArrowRight, IconPlus, IconSquareRoundedCheck } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import TextareaComponent from "@/components/TextAreaComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import classes from "./considerations.module.css";

export const runtime = "edge";

export default function Considerations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);

  const { demographics } = userDetails || {};
  const { sex } = demographics || {};

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  const placeholder =
    sex === "female"
      ? "(Optional) Vegetarian, pregnancy, diabetes, allergy, etc..."
      : "(Optional) Vegetarian, diabetes, allergy, surgery, etc...";

  const handleCreateRoutine = useCallback(() => {
    updateSpecialConsiderations(text);
    createRoutine(userDetails);
  }, []);

  const updateSpecialConsiderations = useCallback(async (text: string) => {
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
    } catch (err) {
      console.log("Error in updateSpecialConsiderations: ", err);
    }
  }, []);

  const createRoutine = useCallback(
    async (userDetails: Partial<UserDataType> | null) => {
      if (!type) return;
      if (disableButton) return;
      if (!userDetails) return;

      setDisableButton(true);

      const { _id: userId, concerns, specialConsiderations } = userDetails;
      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/routines?${searchParams.toString()}`;

      try {
        const response = await callTheServer({
          endpoint: "createRoutineRoute",
          method: "POST",
          body: {
            userId,
            type,
            part,
            concerns,
            specialConsiderations,
          },
        });

        if (response.status === 200) {
          if (response.error === "subscription expired") {
            const { subscriptions } = userDetails || {};
            const { improvement } = subscriptions || {};
            const { isTrialUsed } = improvement || {};

            const buttonText = !!isTrialUsed ? "Add" : "Try free for 1 day";
            const buttonIcon = !!isTrialUsed ? (
              <IconPlus className="icon" />
            ) : (
              <IconSquareRoundedCheck className="icon" />
            );

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
              title: `Add the Improvement Coach`,
              price: "3",
              isCentered: true,
              modalType: "improvement",
              underButtonText: "No credit card required",
              onClick,
              buttonText,
              buttonIcon,
              onClose: () => fetchUserData(setUserDetails),
            });

            return;
          }
          saveToLocalStorage("runningAnalyses", { [type]: true }, "add");
          router.replace(redirectUrl);
        }
        setDisableButton(false);
      } catch (err) {
        setDisableButton(false);
      }
    },
    [type, part, disableButton]
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn title="Special considerations" showReturn />
        <InstructionContainer
          title="Instructions"
          instruction={"Write any special considerations or preferences you have."}
          description="Your routine will be adapted to them."
          customStyles={{ flex: 0 }}
        />
        <Stack className={classes.wrapper}>
          <TextareaComponent text={text} placeholder={placeholder} setText={setText} />
          <Button loading={disableButton} onClick={handleCreateRoutine} disabled={disableButton}>
            Next
            <IconArrowRight className="icon" style={{ marginLeft: rem(8) }} />
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
