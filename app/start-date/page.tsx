"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { useRouter } from "@/helpers/custom-router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { daysFrom } from "@/helpers/utils";
import { UserConcernType, UserSubscriptionsType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import classes from "./start-date.module.css";

export const runtime = "edge";

type CreateRoutineProps = {
  startDate: Date | null;
  concerns?: UserConcernType[];
  subscriptions?: UserSubscriptionsType;
  specialConsiderations: string;
};

export default function StartDate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { specialConsiderations } = userDetails || {};

  const part = searchParams.get("part");

  const handleCreateRoutine = () => {
    const { concerns, subscriptions } = userDetails || {};

    createRoutine({
      concerns,
      startDate,
      subscriptions,
      specialConsiderations: specialConsiderations || "",
    });
  };

  const createRoutine = useCallback(
    async ({ concerns, startDate, subscriptions, specialConsiderations }: CreateRoutineProps) => {
      if (isLoading || !startDate || !concerns || !subscriptions) return;
      setIsLoading(true);

      const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/tasks?${searchParams.toString()}`;

      try {
        const response = await callTheServer({
          endpoint: "createRoutine",
          method: "POST",
          body: {
            part,
            concerns,
            routineStartDate: startDate,
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
    [part, startDate, isLoading, userDetails]
  );

  const text = startDate
    ? startDate.toDateString()
    : "Click on the calendar to select the start date";

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn title="Choose start date" showReturn />
        <InstructionContainer
          title="Instructions"
          instruction={"Choose the start date of your routine."}
          description="Consider scheduling your routine 3-4 days into the future. This will give you time to adjust and get the necessary products."
          customStyles={{ flex: 0 }}
        />
        <Stack className={classes.wrapper}>
          <DatePicker
            level="month"
            m="auto"
            w="100%"
            minDate={new Date()}
            maxDate={daysFrom({ days: 7 })}
            value={startDate}
            onChange={setStartDate}
            classNames={{ calendarHeader: classes.calendarHeader, month: classes.calendarMonth }}
          />
          <Text className={classes.date}>{text}</Text>
          <Button
            loading={isLoading}
            onClick={handleCreateRoutine}
            disabled={isLoading || !startDate}
          >
            Create
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
