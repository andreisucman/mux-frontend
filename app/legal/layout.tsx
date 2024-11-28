"use client";

import React from "react";
import { Stack } from "@mantine/core";
import AffixButton from "./AffixButton";

type Props = {
  children: React.ReactNode;
};

export const runtime = "edge";

export default function LegalLayout({ children }: Props) {
  return (
    <Stack flex={1} className="smallPage">
      {children} <AffixButton />
    </Stack>
  );
}
