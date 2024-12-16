import React from "react";
import ClubDataContextProvider from "@/context/ClubDataContext";

type Props = {
  children: React.ReactNode;
};

export default function ClubLayout({ children }: Props) {
  return <ClubDataContextProvider>{children}</ClubDataContextProvider>;
}
