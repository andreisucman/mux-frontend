import React from "react";
import BlurChoicesProvider from "@/context/BlurChoicesContext";

type Props = { children: React.ReactNode };

export default function UploadProofLayout({ children }: Props) {
  return <BlurChoicesProvider>{children}</BlurChoicesProvider>;
}
