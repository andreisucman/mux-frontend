import React from "react";
import ClubDataContextProvider from "@/context/ClubDataContext";
import UserContextProvider from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function ClubLayout({ children }: Props) {
  return (
    <UserContextProvider>
      <ClubDataContextProvider>{children}</ClubDataContextProvider>
    </UserContextProvider>
  );
}
