"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { Button, PinInput, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import classes from "./verify-email.module.css";

export const runtime = "edge";

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const next = searchParams.get("next");

  const handleRedirect = useCallback((next: string | null) => {
    if (next) {
      const decodedUri = decodeURIComponent(next);
      router.replace(decodedUri);
    } else {
      router.replace("/routine");
    }
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "verifyEmail",
        method: "POST",
        body: { code },
      });
      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        openSuccessModal({ description: response.message, onClose: () => handleRedirect(next) });
      }
    } catch (err) {
      openErrorModal();
      console.log("Error in handleVerifyEmail: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [next, isLoading]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          <Title order={1} className={classes.title}>
            Enter the code from the email
          </Title>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setCode} />
          <Button disabled={code.length < 6} loading={isLoading} onClick={handleVerifyEmail}>
            Continue
            <IconArrowRight className={`icon ${classes.icon}`} />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
