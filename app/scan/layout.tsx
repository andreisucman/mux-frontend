import React from "react";
import BlurChoicesProvider from "@/context/BlurChoicesContext";
import UploadPartsChoicesProvider from "@/context/UploadPartsChoicesContext";

type Props = { children: React.ReactNode };

export default function ScanLayout({ children }: Props) {
  return (
    <BlurChoicesProvider>
      <UploadPartsChoicesProvider>{children}</UploadPartsChoicesProvider>
    </BlurChoicesProvider>
  );
}
