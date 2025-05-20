import React from "react";
import TurnstileComponent from "@/components/TurnstileComponent";
import ClubDataContextProvider from "@/context/ClubDataContext";

type Props = {
  children: React.ReactNode;
};

export default function ClubLayout({ children }: Props) {
  return <ClubDataContextProvider>{children}</ClubDataContextProvider>;
}
