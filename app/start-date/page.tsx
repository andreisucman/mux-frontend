"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Group, Radio, Stack, Text, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import addImprovementCoach from "@/helpers/addImprovementCoach";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openPaymentModal from "@/helpers/openPaymentModal";
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
  const [creationMode, setCreationMode] = useState("scratch");
  const { specialConsiderations, concerns, subscriptions, nextRoutine } = userDetails || {};

  const part = searchParams.get("part");

  const savedCreationMode = getFromLocalStorage("creationMode");

  const handleChangeCreationMode = useCallback((creationMode: string) => {
    setCreationMode(creationMode);
    saveToLocalStorage("creationMode", creationMode);
  }, []);

  const createRoutine = async ({
    concerns,
    startDate,
    subscriptions,
    specialConsiderations,
  }: CreateRoutineProps) => {
    if (isLoading || !startDate || !concerns || !subscriptions) return;
    setIsLoading(true);

    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/tasks?${searchParams.toString()}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await callTheServer({
      endpoint: "createRoutine",
      method: "POST",
      body: {
        part,
        concerns,
        creationMode,
        routineStartDate: startDate,
        specialConsiderations,
        timeZone,
      },
    });

    if (response.status === 200) {
      if (response.error === "subscription expired") {
        const { improvement } = subscriptions || {};

        addImprovementCoach({
          improvementSubscription: improvement,
          onComplete: () =>
            createRoutine({ concerns, startDate, subscriptions, specialConsiderations }),
          redirectUrl,
          cancelUrl: redirectUrl,
          setUserDetails,
        });

        return;
      }
      router.replace(redirectUrl);
    } else {
      setIsLoading(false);
    }
  };

  const text = startDate ? startDate.toDateString() : "Click on the calendar to select date";

  const isNotFirstTime = useMemo(() => {
    if (!part) {
      return nextRoutine?.some((obj) => !!obj.date);
    }
    return nextRoutine?.some((obj) => obj.part === part && !!obj.date);
  }, [part, nextRoutine]);

  const description = isNotFirstTime
    ? ""
    : "Consider scheduling your routine 3-4 days into the future. This will give you time to adjust and get the necessary products.";

  useEffect(() => {
    if (savedCreationMode) {
      setCreationMode(savedCreationMode as string);
    }
  }, [savedCreationMode]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader title="Choose start date" />
        <InstructionContainer
          title="Instructions"
          instruction={"Choose the start date of your routine."}
          description={description}
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
            hideOutsideDates
            classNames={{ calendarHeader: classes.calendarHeader, month: classes.calendarMonth }}
          />
          <Text className={classes.date}>{text}</Text>
          {isNotFirstTime && (
            <Radio.Group name="routineMode" value={creationMode} onChange={handleChangeCreationMode}>
              <Group className={classes.radioButtonsGroup}>
                <Radio
                  value="continue"
                  label="Review existing"
                  classNames={{
                    root: classes.radioButton,
                    body: classes.radioBody,
                    labelWrapper: classes.labelWrapper,
                    label: classes.label,
                  }}
                />
                <Radio
                  value="scratch"
                  label="From scratch"
                  classNames={{
                    root: classes.radioButton,
                    body: classes.radioBody,
                    labelWrapper: classes.labelWrapper,
                    label: classes.label,
                  }}
                />
              </Group>
            </Radio.Group>
          )}
          <Button
            loading={isLoading}
            onClick={() =>
              createRoutine({
                concerns,
                startDate,
                subscriptions,
                specialConsiderations: specialConsiderations || "",
              })
            }
            disabled={isLoading || !startDate}
          >
            Create
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
