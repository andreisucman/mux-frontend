import React, { useState } from "react";
import { Turnstile } from "next-turnstile";
import { Stack } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import classes from "./TurnstileComponent.module.css";

type Props = {
  part: string | null;
  concern: string | null;
  userName: string;
  page: "routines" | "progress" | "diary" | "proof";
};

export default function TurnstileComponent({ part, concern, userName, page }: Props) {
  const [showComponent, setShowComponent] = useState(true);

  const handleVerify = React.useCallback(
    async (token: string) => {
      const response = await callTheServer({
        endpoint: "verifyTurnstileToekn",
        method: "POST",
        body: { token },
      });

      if (response.message) {
        setShowComponent(false);
      }
    },
    [part, concern, userName, page]
  );

  const handleRecordView = async () => {
    if (!part || !concern) return;

    const { ClientJS } = await import("clientjs");
    const fingerprint = new ClientJS().getFingerprint();

    await callTheServer({
      endpoint: "registerView",
      method: "POST",
      body: { fingerprint, userName, part, concern, page },
    });
  };

  if (!part || !concern) return null;

  return (
    <>
      {showComponent && (
        <Stack className={classes.container}>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            sandbox={process.env.NODE_ENV === "development"}
            onVerify={handleVerify}
            appearance="interaction-only"
            theme="auto"
          />
        </Stack>
      )}
    </>
  );
}
