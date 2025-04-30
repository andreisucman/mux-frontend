"use client";

import React from "react";
import BlurChoicesProvider from "@/context/BlurChoicesContext";
import ScanPartsChoicesProvider from "@/context/CreateRoutineContext";

type Props = {
  children: React.ReactNode;
};

export default function ScanLayout({ children }: Props) {
  return (
    <BlurChoicesProvider>
      <ScanPartsChoicesProvider>{children}</ScanPartsChoicesProvider>
    </BlurChoicesProvider>
  );
}
