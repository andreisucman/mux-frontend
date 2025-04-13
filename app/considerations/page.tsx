"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import TextareaComponent from "@/components/TextAreaComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import classes from "./considerations.module.css";

export const runtime = "edge";

export default function Considerations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);

  const { specialConsiderations } = userDetails || {};

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

  async function onButtonClick(text: string) {
    setIsLoading(true);
    updateSpecialConsiderations(text);

    const stringParams = searchParams.toString();
    router.push(`/start-date${stringParams ? `?${stringParams}` : ""}`);
  }

  useEffect(() => {
    if (!specialConsiderations) return;

    setText(specialConsiderations || "");
  }, [specialConsiderations]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader title="Important details" />
        <InstructionContainer
          title="Instructions"
          instruction={"Add details about yourself to tailor your routine."}
          description="Adding this can significantly improve the effectiveness of the routine."
          customStyles={{ flex: 0 }}
        />
        <Stack className={classes.wrapper}>
          <TextareaComponent
            text={text}
            placeholder={
              "I have allergy to caffeine. Three months ago I was diagnosed with diabetes type 2, and therefore I can't take sugar-based medications or anything containing high glucose. I live in Florida. For the past month I have tried XYZ topical cream to improve my acne but saw no effect..."
            }
            setText={setText}
          />
          <Button loading={isLoading} onClick={() => onButtonClick(text)} disabled={isLoading}>
            Next
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
