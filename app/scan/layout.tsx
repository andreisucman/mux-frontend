import React from "react";
import BlurChoicesProvider from "@/context/BlurChoicesContext";
import UploadPartsChoicesProvider from "@/context/UploadPartsChoicesContext";
import UserContextProvider from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function ScanLayout({ children }: Props) {
  return (
    <UserContextProvider>
      <BlurChoicesProvider>
        <UploadPartsChoicesProvider>{children}</UploadPartsChoicesProvider>
      </BlurChoicesProvider>
    </UserContextProvider>
  );
}
