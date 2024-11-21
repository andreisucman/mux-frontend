import React from "react";
import UserContextProvider from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <UserContextProvider>{children}</UserContextProvider>;
}
