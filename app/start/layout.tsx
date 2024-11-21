import React from "react";
import UserContextProvider from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function StartLayout({ children }: Props) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
