import React, { use } from "react";
import ClubDataContextProvider from "@/context/ClubDataContext";

type Props = {
  children: React.ReactNode;
  params: Promise<{ userName: string }>;
};

export default function ClubLayout({ children, params }: Props) {
  const { userName } = use(params);
  return <ClubDataContextProvider userName={userName}>{children}</ClubDataContextProvider>;
}
