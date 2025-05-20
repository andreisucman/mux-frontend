import React, { useState } from "react";
import { Turnstile } from "next-turnstile";
import { Stack } from "@mantine/core";
import classes from "./TurnstileComponent.module.css";

export default function TurnstileComponent() {
  const [showComponent, setShowComponent] = useState(true);

  return (
    <>
      {showComponent && (
        <Stack className={classes.container}>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            sandbox={process.env.NODE_ENV === "development"}
            onVerify={() => setShowComponent(false)}
            appearance="interaction-only"
            theme="auto"
          />
        </Stack>
      )}
    </>
  );
}
