import React from "react";
import { Turnstile } from "next-turnstile";
import callTheServer from "@/functions/callTheServer";
import classes from "./TurnstileComponent.module.css";

type Props = {
  part: string | null;
  concern: string | null;
  userName: string;
  page: "routines" | "progress" | "diary" | "proof";
};

export default function TurnstileComponent({ part, concern, userName, page }: Props) {
  const handleVerify = React.useCallback(
    async (token: string) => {
      if (!part || !concern) return;

      const { ClientJS } = await import("clientjs");
      const fingerprint = new ClientJS().getFingerprint();

      await callTheServer({
        endpoint: "registerView",
        method: "POST",
        body: { token, fingerprint, userName, part, concern, page },
      });
    },
    [part, concern, userName, page]
  );

  if (!part || !concern) return null;

  return (
    <Turnstile
      className={classes.container}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      sandbox={process.env.NODE_ENV === "development"}
      onVerify={handleVerify}
      onError={(code) => console.log("Turnstile error", code)}
      appearance="interaction-only"
      theme="auto"
    />
  );
}
