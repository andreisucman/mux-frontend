"use client";

import React, { useCallback, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import { ConsiderationsInput } from "./ConsiderationsInput";
import RoutineList from "./RoutineList";

export const runtime = "edge";

export default function MyRoutines() {
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { specialConsiderations } = userDetails || {};
  const type = searchParams.get("type") || "head";

  const updateSpecialConsiderations = useCallback(
    async (value: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
      if (!value.trim()) return;

      setIsLoading(true);

      try {
        const response = await callTheServer({
          endpoint: "updateSpecialConsiderations",
          method: "POST",
          body: { text: value },
        });
        if (response.status === 200) {
          setUserDetails(
            (prev: UserDataType) =>
              ({ ...prev, specialConsiderations: value || "" }) as UserDataType
          );
        }
      } catch (err) {
        console.log("Error in updateSpecialConsiderations: ", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const { streaks } = userDetails || {};
  const { healthStreak, faceStreak, bodyStreak } = streaks || {};

  const streak =
    type === "health"
      ? healthStreak
      : type === "head"
        ? faceStreak
        : type === "body"
          ? bodyStreak
          : undefined;

  return (
    <Stack flex={1}>
      <PageHeader title="My routines" />
      <ConsiderationsInput
        placeholder={"Special considerations"}
        defaultValue={specialConsiderations || ""}
        saveValue={updateSpecialConsiderations}
        maxLength={300}
      />
      <RoutineList serie={streak} type={type as string} />
    </Stack>
  );
}
