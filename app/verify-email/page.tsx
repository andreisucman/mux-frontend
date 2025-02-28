"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, PinInput, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { UserDataType } from "@/types/global";
import classes from "./verify-email.module.css";

export const runtime = "edge";

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [canResendOn, setCanResendOn] = useState(new Date());
  const { email } = userDetails || {};

  const redirectUrl = searchParams.get("redirectUrl");

  const handleRedirect = useCallback((redirectUrl: string | null) => {
    if (redirectUrl) {
      const decodedUrl = decodeURIComponent(redirectUrl);
      router.replace(decodedUrl);
    } else {
      router.back();
    }
  }, []);

  const handleVerifyEmail = useCallback(
    async (code: string) => {
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
            setIsLoading(false);
            return;
          }
        }

        setUserDetails((prev: UserDataType) => ({ ...prev, emailVerified: response.message }));

        if (response.message) {
          handleRedirect(redirectUrl);
        }
      } catch (err) {
        setCode("");
        openErrorModal();
      }
    },
    [isLoading, userDetails, redirectUrl]
  );

  const handleResendEmail = useCallback(
    async (canResendOn: Date) => {
      try {
        if (canResendOn > new Date()) {
          openErrorModal({ description: `Please retry in a minute.` });
          return;
        }

        const newCanResendDate = new Date(new Date().getTime() + 60000);
        saveToLocalStorage("canResendEmailVerificaitonOn", newCanResendDate);
        setCanResendOn(newCanResendDate);

        const response = await callTheServer({ endpoint: "sendConfirmationCode", method: "POST" });

        if (response.status === 200) {
          openInfoModal({
            title: "✔️ Success!",
            description: `The email with the code has been resent to ${email}.`,
          });

          const iId = setInterval(() => {
            setCanResendOn((prev: Date) => {
              if (prev <= new Date()) {
                clearInterval(iId);
                setCanResendOn(new Date());
              }
              return prev;
            });
          }, 1000);
        }
      } catch (err) {
        openErrorModal();
      }
    },
    [email]
  );

  useEffect(() => {
    const canResendEmailVerificaitonOn = getFromLocalStorage("canResendEmailVerificaitonOn");
    if (canResendEmailVerificaitonOn) {
      setCanResendOn(new Date((canResendEmailVerificaitonOn as Date | null) || 0));
    }
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          <Title order={1} className={classes.title}>
            Enter the code from the email
          </Title>
          {email && <Text ta="center">{`We've sent an email with the code to ${email}.`}</Text>}
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setCode} />
          <Button
            disabled={code.length < 5}
            loading={isLoading}
            onClick={() => handleVerifyEmail(code)}
          >
            Continue
          </Button>
          <Button
            variant="default"
            size="compact-xs"
            onClick={() => handleResendEmail(canResendOn)}
            disabled={canResendOn > new Date()}
          >
            Resend
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
