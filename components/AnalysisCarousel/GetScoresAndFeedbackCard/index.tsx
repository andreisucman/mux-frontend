"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconCheckbox } from "@tabler/icons-react";
import { Button, Stack, Text, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createBuyScanSession from "@/functions/createBuyScanSession";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./GetScoresAndFeedbackCard.module.css";

type Props = {
  title: string;
};

export default function GetScoresAndFeedbackCard({ title }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [loadingButton, setLoadingButton] = useState<"analysis" | "return" | null>(null);

  const { _id: userId, scanAnalysisQuota } = userDetails || {};
  const success = searchParams.get("success");

  const handleStartAnalysis = useCallback(async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}`;

    try {
      if (!userId) throw new Error("Missing user id");

      setLoadingButton("analysis");

      if (scanAnalysisQuota === 0) {
        setLoadingButton(null);
        createBuyScanSession({
          redirectUrl: `${redirectUrl}?success=true`,
          cancelUrl: redirectUrl,
          setUserDetails,
        });
        return;
      }

      const response = await callTheServer({
        endpoint: "getScoresAndFeedback",
        method: "POST",
      });

      if (response.status === 200) {
        if (response.error) {
          setLoadingButton(null);

          if (response.error === "buy scan analysis") {
            createBuyScanSession({
              redirectUrl: `${redirectUrl}?success=true`,
              cancelUrl: redirectUrl,
              setUserDetails,
            });
            return;
          }

          openErrorModal({ description: response.error });
          return;
        }
        router.push(`/wait?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    } catch (err) {
      setLoadingButton(null);
    }
  }, [userDetails]);

  const handleReturnToRoutines = useCallback(() => {
    setLoadingButton("return");
    router.push("/routines");
  }, []);

  useEffect(() => {
    if (!success) return;

    callTheServer({ endpoint: "getUserData", method: "GET" }).then((res) => {
      if (res.status === 200) {
        setUserDetails(res.message);
      }
    });
  }, [success]);

  return (
    <Stack className={`${classes.container} scrollbar`}>
      <Text className={classes.title} c="dimmed">
        {title}
      </Text>
      <Stack className={classes.content}>
        <Stack className={classes.box}>
          <IconCheckbox className={classes.icon} />
          <Title order={3} ta="center">
            Scan uploaded
          </Title>
          <Button
            loading={loadingButton === "analysis"}
            disabled={loadingButton !== null}
            onClick={handleStartAnalysis}
          >
            Get scores and feedback
          </Button>
          <Button
            variant="default"
            loading={loadingButton === "return"}
            disabled={loadingButton !== null}
            onClick={handleReturnToRoutines}
          >
            Go to routines
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
