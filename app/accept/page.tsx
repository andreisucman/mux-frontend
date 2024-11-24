"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";
import getBrowserFingerprint from "get-browser-fingerprint";
import { Button, Stack, Title } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";
import TosCheckbox from "@/components/TosCheckbox";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import openErrorModal from "@/helpers/openErrorModal";
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

  const { _id: userId } = userDetails || {};

  const startTheFlow = useCallback(async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      if (!tosAccepted) return;
      setIsLoading(true);

      if (!userId) {
        const fingerprint = await getBrowserFingerprint();

        const response = await callTheServer({
          endpoint: "startTheFlow",
          method: "POST",
          body: {
            userId,
            tosAccepted,
            timeZone,
            fingerprint,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal();
            setIsLoading(false);
            return;
          }

          setUserDetails((prev: UserDataType) => ({
            ...prev,
            ...response.message,
          }));

          nprogress.start();
        }
      }

      const encodedNext = searchParams.get("next") || "/scan/progress?type=head";
      const next = decodeAndCheckUriComponent(encodedNext);

      if (next) {
        router.replace(next);
      }
    } catch (err) {
      openErrorModal();
      console.log("Error in startTheFlow: ", err);
      setIsLoading(false);
    }
  }, [tosAccepted, userId]);

  return (
    <Stack className={classes.container}>
      <Title order={1}>Review the Terms</Title>
      <Stack className={classes.content}>
        <TermsLegalBody />
      </Stack>
      <TosCheckbox
        highlightTos={highlightTos}
        tosAccepted={tosAccepted}
        setHighlightTos={setHighlightTos}
        setTosAccepted={setTosAccepted}
      />
      <Button
        className={classes.button}
        disabled={!tosAccepted || isLoading}
        loading={isLoading}
        onClick={startTheFlow}
      >
        Next <IconArrowRight className="icon" />
      </Button>
    </Stack>
  );
}
