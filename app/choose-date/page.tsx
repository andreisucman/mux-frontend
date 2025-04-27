"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Group, Radio, Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { daysFrom } from "@/helpers/utils";
import { UserConcernType } from "@/types/global";
import classes from "./choose-date.module.css";

export const runtime = "edge";

type CreateRoutineProps = {
  startDate: Date | null;
  concerns?: UserConcernType[];
  specialConsiderations: string;
};

export default function ChooseDatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { userDetails } = useContext(UserContext);
  const [creationMode, setCreationMode] = useState("scratch");
  const { specialConsiderations, concerns, nextRoutine } = userDetails || {};

  const part = searchParams.get("part") || "face";

  const savedCreationMode = getFromLocalStorage("creationMode");

  const handleChangeCreationMode = useCallback((creationMode: string) => {
    setCreationMode(creationMode);
    saveToLocalStorage("creationMode", creationMode);
  }, []);

  const createRoutine = async ({
    startDate,
    concerns = [],
    specialConsiderations,
  }: CreateRoutineProps) => {
    if (isLoading || !startDate) return;
    setIsLoading(true);

    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/tasks?${searchParams.toString()}`;

    const partConcerns = concerns.filter((co) => co.part === part);

    const response = await callTheServer({
      endpoint: "createRoutine",
      method: "POST",
      body: {
        part,
        concerns: partConcerns,
        creationMode,
        routineStartDate: startDate,
        specialConsiderations,
      },
    });

    if (response.status === 200) {
      router.replace(redirectUrl);
    } else {
      setIsLoading(false);
    }
  };

  const text = startDate ? startDate.toDateString() : "Click on the calendar to select a date";

  const isNotFirstTime = useMemo(() => {
    if (!part) {
      return nextRoutine?.some((obj) => !!obj.date);
    }
    return nextRoutine?.some((obj) => obj.part === part && !!obj.date);
  }, [part, nextRoutine]);

  useEffect(() => {
    if (savedCreationMode) {
      setCreationMode(savedCreationMode as string);
    }
  }, [savedCreationMode]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Choose start date" />
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
      </Stack>
      <Button
        loading={isLoading}
        onClick={() =>
          createRoutine({
            concerns,
            startDate,
            specialConsiderations: specialConsiderations || "",
          })
        }
        disabled={isLoading || !startDate}
      >
        Create
      </Button>
    </Stack>
  );
}
