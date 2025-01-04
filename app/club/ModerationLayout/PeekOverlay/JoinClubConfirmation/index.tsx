"use client";

import React, { useMemo, useState } from "react";
import { IconArrowRight, IconCamera, IconCash, IconTargetOff } from "@tabler/icons-react";
import { rem, Stack, Table, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import TosCheckbox from "@/components/TosCheckbox";
import openLegalBody from "@/helpers/openLegalBody";
import classes from "./Confirmation.module.css";

const tableData = {
  body: [
    [<IconTargetOff className="icon icon__title" />, "The membership in the Club is free."],
    [<IconCamera className="icon icon__title" />, "All of your data is private by default."],
    [
      <IconCash className="icon icon__title" />,
      "You can enable data sharing to inspire others and earn when others follow you.",
    ],
    [
      <IconTargetOff className="icon icon__title" />,
      "You can buy the Peek License to see the progress of other Club members (Next).",
    ],
  ],
};

type Props = {
  handleJoinClub: () => Promise<void>;
};

export default function JoinClubConfirmation({ handleJoinClub }: Props) {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await handleJoinClub();
    setIsLoading(false);
  };

  const checkboxLabel = useMemo(
    () => (
      <Text lineClamp={2} size="sm">
        I have read, understood and accept the{" "}
        <span
          onClickCapture={() => openLegalBody("club")}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >{`Club's Terms of Service`}</span>
      </Text>
    ),
    []
  );

  return (
    <Stack flex={1}>
      Here is what you need to know:
      <Table data={tableData} classNames={{ td: classes.td, th: classes.th }} />
      <Stack className={classes.checkboxWrapper}>
        <TosCheckbox
          label={checkboxLabel}
          tosAccepted={tosAccepted}
          highlightTos={highlightTos}
          setHighlightTos={setHighlightTos}
          setTosAccepted={setTosAccepted}
        />
        <GlowingButton
          text="Join the Club and continue"
          disabled={isLoading}
          loading={isLoading}
          iconPosition="right"
          icon={<IconArrowRight className="icon" style={{ marginLeft: rem(6) }} />}
          containerStyles={{ margin: "auto" }}
          onClick={handleClick}
        />
      </Stack>
    </Stack>
  );
}
