"use client";

import React, { useCallback, useMemo, useState } from "react";
import { IconTargetArrow } from "@tabler/icons-react";
import { rem, Stack, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import TosCheckbox from "@/components/TosCheckbox";
import openLegalBody from "@/helpers/openLegalBody";
import Confirmation from "./Confirmation";
import classes from "./join.module.css";

export const runtime = "edge";

const tableData = {
  caption: "From their monthly subscription payment",
  head: ["Event", "Reward"],
  body: [["New follower", "25%"]],
};

export default function ClubJoin() {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);

  const onStart = useCallback(() => {
    if (!tosAccepted) {
      setHighlightTos(true);

      const tId = setTimeout(() => {
        setHighlightTos(false);
        clearTimeout(tId);
      }, 6000);
      return;
    }

    modals.openContextModal({
      centered: true,
      modal: "general",
      innerProps: <Confirmation />,
      title: (
        <Title order={5} component={"p"}>
          When you join the Club
        </Title>
      ),
    });
  }, [tosAccepted]);

  const checkboxLabel = useMemo(
    () => (
      <Text component="div" lineClamp={2} size="sm">
        I have read, understood and accept the{" "}
        <Text
          onClickCapture={() => openLegalBody("club")}
          style={{ cursor: "pointer" }}
        >{`Club's Terms of Service`}</Text>
      </Text>
    ),
    []
  );

  return (
    <>
      <Stack className={classes.container}>
        <PageHeader title="Join the Club" hidePartDropdown hideTypeDropdown showReturn />
        <Stack className={classes.wrapper}>
          <Stack className={classes.announcement}>
            <Title order={2}>Welcome</Title>
            <Text ta="center">
              When you join the Club you let other people see your progress to get inspired.
            </Text>
            <Text ta="center">You are rewarded for every user who follows you.</Text>
          </Stack>
          <Table data={tableData} ta={"center"} classNames={{ th: classes.th, td: classes.td }} />
          <TosCheckbox
            label={checkboxLabel}
            highlightTos={highlightTos}
            setHighlightTos={setHighlightTos}
            setTosAccepted={setTosAccepted}
            tosAccepted={tosAccepted}
          />
          <GlowingButton
            text="Join the Club"
            icon={<IconTargetArrow className="icon" style={{ marginRight: rem(8) }} />}
            onClick={onStart}
          />
        </Stack>
      </Stack>
    </>
  );
}
