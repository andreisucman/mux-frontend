"use client";

import React, { useState } from "react";
import { Turnstile } from "next-turnstile";
import classes from "./TurnstileComponent.module.css";

export default function TurnstileComponent() {
  const [showComponent, setShowComponent] = useState(true);

  return (
    <>
      {showComponent && (
        <Turnstile
          className={classes.container}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          sandbox={process.env.NODE_ENV === "development"}
          onVerify={() => setShowComponent(false)}
          onError={() => setShowComponent(false)}
          retry="never"
          appearance="interaction-only"
          theme="auto"
        />
      )}
    </>
  );
}
