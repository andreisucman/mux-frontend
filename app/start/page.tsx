"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconLicense } from "@tabler/icons-react";
import { Button, Stack } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";
import PageHeader from "@/components/PageHeader";
import TosCheckbox from "@/components/TosCheckbox";
import classes from "./start.module.css";

export const runtime = "edge";

export default function StartIndexPage() {
  const router = useRouter();
  const [highlightTos, setHighlightTos] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  const handleNext = () => {
    router.push("/start/gender");
    nprogress.start();
  };

  return (
    <Stack className={classes.container}>
      <PageHeader name="Review the Terms" icon={<IconLicense className="icon icon__title" />} />
      <Stack className={classes.content}>
        <TermsLegalBody />
      </Stack>
      <TosCheckbox
        highlightTos={highlightTos}
        tosAccepted={tosAccepted}
        setHighlightTos={setHighlightTos}
        setTosAccepted={setTosAccepted}
      />
      <Button className={classes.button} disabled={!tosAccepted} onClick={handleNext}>
        Next <IconArrowRight className="icon" />
      </Button>
    </Stack>
  );
}
