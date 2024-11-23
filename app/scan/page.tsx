"use client";

import React, { useCallback, useContext, useState } from "react";
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
import { UserDataType } from "@/types/global";
import classes from "./start.module.css";

export const runtime = "edge";

export default function StartIndexPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [highlightTos, setHighlightTos] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  return (
    <Stack className={classes.container}>
      <Title order={1}>Scan yourself</Title>
      <Stack className={classes.content}></Stack>
    </Stack>
  );
}
