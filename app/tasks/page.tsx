"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import { ConsiderationsInput } from "../../components/ConsiderationsInput";
import SkeletonWrapper from "../SkeletonWrapper";
import TasksList from "./TasksList";

export const runtime = "edge";

export default function Tasks() {
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
  const {
    healthStreak = 0,
    faceStreak = 0,
    scalpStreak = 0,
    mouthStreak = 0,
    bodyStreak = 0,
  } = streaks || {};

  const streak = useMemo(() => {
    return type === "health"
      ? healthStreak
      : type === "body"
        ? bodyStreak
        : faceStreak + scalpStreak + mouthStreak;
  }, [type, healthStreak, bodyStreak, faceStreak, scalpStreak, mouthStreak]);

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader title="Today's tasks" hidePartDropdown />
        <ConsiderationsInput
          placeholder={"Special considerations"}
          defaultValue={specialConsiderations || ""}
          saveValue={updateSpecialConsiderations}
          maxLength={300}
        />
        <TasksList serie={streak} type={type as string} />
      </SkeletonWrapper>
    </Stack>
  );
}
