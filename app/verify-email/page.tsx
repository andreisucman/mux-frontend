"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import { Button, PinInput, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserContext } from "@/context/UserContext";
import verifyEmail from "@/functions/verifyEmail";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
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
  const { email, emailVerified } = userDetails || {};

  const redirectUrl = searchParams.get("redirectUrl");

  const handleRedirect = useCallback((redirectUrl: string | null) => {
    if (redirectUrl) {
      const decodedUrl = decodeURIComponent(redirectUrl);
      router.replace(decodedUrl);
    } else {
      router.back();
    }
  }, []);

  const handleVerifyEmail = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const isSuccess = await verifyEmail({ code });
      setUserDetails((prev: UserDataType) => ({ ...prev, emailVerified: isSuccess }));
    } catch (err) {
      openErrorModal();
      setIsLoading;
      console.log("Error in handleVerifyEmail: ", err);
    }
  };

  useEffect(() => {
    if (!emailVerified) return;
    handleRedirect(redirectUrl);
  }, [emailVerified]);

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
