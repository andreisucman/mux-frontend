"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import cn from "classnames";
import { Button, Stack, Text } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";
import PageHeader from "@/components/PageHeader";
import TosCheckbox from "@/components/TosCheckbox";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import openLegalBody from "@/helpers/openLegalBody";
import { decodeAndCheckUriComponent } from "@/helpers/utils";
import { UserDataType } from "@/types/global";
import classes from "./accept.module.css";

export const runtime = "edge";

export default function AcceptIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [highlightTos, setHighlightTos] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLButtonElement>({
    offset: 0,
    duration: 500,
  });

  const { _id: userId, demographics } = userDetails || {};

  const startTheFlow = useCallback(async () => {
    try {
      if (!tosAccepted) return;
      setIsLoading(true);

      if (!userId) {
        const response = await callTheServer({
          endpoint: "startTheFlow",
          method: "POST",
          body: {
            tosAccepted,
            demographics,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal();
            setIsLoading(false);
            return;
          }

          const { demographics, ...otherData } = response.message;

          setUserDetails((prev: UserDataType) => ({
            ...prev,
            ...otherData,
            demographics: { ...demographics, ...(userDetails || {}).demographics },
          }));

          nprogress.start();
        }
      }

      const encodedRedirectUrl = searchParams.get("redirectUrl") || "/scan";
      const redirectUrl = decodeAndCheckUriComponent(encodedRedirectUrl);

      if (redirectUrl) {
        router.replace(redirectUrl);
      }
    } catch (err) {
      openErrorModal();
      setIsLoading(false);
    }
  }, [tosAccepted, userDetails]);

  const checkboxLabel = useMemo(
    () => (
      <Text lineClamp={2} size="sm">
        I have read, understood and accept the <span>Terms of Service</span> and{" "}
        <span
          onClickCapture={() => openLegalBody("privacy")}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >
          Privacy policy
        </span>
      </Text>
    ),
    []
  );

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Review terms" />
      <Stack className={cn(classes.content, "scrollbar")}>
        <TermsLegalBody />
      </Stack>
      <TosCheckbox
        label={checkboxLabel}
        highlightTos={highlightTos}
        tosAccepted={tosAccepted}
        setHighlightTos={setHighlightTos}
        setTosAccepted={() => {
          scrollIntoView();
          setTosAccepted((prev) => !prev);
        }}
      />
      <Button
        className={classes.button}
        disabled={!tosAccepted || isLoading}
        loading={isLoading}
        ref={targetRef}
        onClick={startTheFlow}
      >
        Next
      </Button>
    </Stack>
  );
}
