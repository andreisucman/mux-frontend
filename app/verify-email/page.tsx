"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { Button, PinInput, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserContext } from "@/context/UserContext";
import verifyEmail from "@/functions/verifyEmail";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./verify-email.module.css";

export const runtime = "edge";

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");
  const { userDetails } = useContext(UserContext);
  const { email } = userDetails || {};

  const redirectUrl = searchParams.get("redirectUrl");

  const handleRedirect = useCallback((redirectUrl: string | null) => {
    if (redirectUrl) {
      const decodedUrl = decodeURIComponent(redirectUrl);
      router.replace(decodedUrl);
    } else {
      router.replace("/routine");
    }
  }, []);

  const handleVerifyEmail = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const isSucess = await verifyEmail({ code });

      if (isSucess) handleRedirect(redirectUrl);
    } catch (err) {
      openErrorModal();
      console.log("Error in handleVerifyEmail: ", err);
    } finally {
      setIsLoading(false);
    }
  }, [redirectUrl, isLoading, code]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          <Title order={1} className={classes.title}>
            Enter the code from the email
          </Title>
          {email && <Text ta="center">{`We've sent an email with the code to ${email}.`}</Text>}
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setCode} />
          <Button disabled={code.length < 5} loading={isLoading} onClick={handleVerifyEmail}>
            Continue
            <IconArrowRight className={`icon ${classes.icon}`} />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
