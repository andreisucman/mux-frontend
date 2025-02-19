"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
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

  const { demographics, specialConsiderations } = userDetails || {};
  const { sex } = demographics || {};

  const placeholder =
    sex === "female"
      ? "(Optional) Vegetarian, pregnancy, diabetes, allergy, etc..."
      : "(Optional) Vegetarian, diabetes, allergy, surgery, etc...";

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
        <PageHeaderWithReturn title="Special considerations" showReturn />
        <InstructionContainer
          title="Instructions"
          instruction={"Add any special considerations or preferences you have."}
          description="Your routine will be adapted to them."
          customStyles={{ flex: 0 }}
        />
        <Stack className={classes.wrapper}>
          <TextareaComponent text={text} placeholder={placeholder} setText={setText} />
          <Button loading={isLoading} onClick={() => onButtonClick(text)} disabled={isLoading}>
            Next
          </Button>
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
