"use client";

import React, { useState } from "react";
import { IconSquareCheck } from "@tabler/icons-react";
import { Button, PinInput, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./enter-code.module.css";

export const runtime = "edge";

export default function AuthPage() {
  const [pin, setPin] = useState("");
  const isMobile = useMediaQuery("(max-width: 36em)");
  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          <Title order={1} className={classes.title}>
            Enter the code from email
          </Title>
          <PinInput length={6} size={isMobile ? "md" : "lg"} onChange={setPin} />
          <Button disabled={pin.length < 6}>
            <IconSquareCheck className={`icon ${classes.icon}`} /> Finalize registration
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
