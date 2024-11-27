import React from "react";
import BlurChoicesProvider from "@/context/BlurChoicesContext";
import UserContextProvider from "@/context/UserContext";

type Props = { children: React.ReactNode };

export default function UploadProofLayout({ children }: Props) {
  return (
    <UserContextProvider>
      <BlurChoicesProvider>{children}</BlurChoicesProvider>
    </UserContextProvider>
  );
}
