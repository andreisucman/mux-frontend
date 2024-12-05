import React from "react";
import UserContextProvider from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function AnalysisLayout({ children }: Props) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
