"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";
import { ClubUserType } from "@/types/global";

const defaultClubContext = {
  publicUserData: null as ClubUserType | null | undefined,
  setPublicUserData: (args: any) => {},
};

export const ClubContext = createContext(defaultClubContext);

type Props = {
  children: React.ReactNode;
};

export default function ClubDataContextProvider({ children }: Props) {
  const params = useParams();
  const userName = Array.isArray(params?.userName) ? params.userName?.[0] : params.userName;
  const [publicUserData, setPublicUserData] = useState<ClubUserType>();

  console.log("publicUserData", publicUserData);

  const fetchPublicUserData = useCallback(
    async (userName?: string) => {
      if (!userName) return;
      const response = await callTheServer({
        endpoint: `getPublicUserData${userName ? `/${userName}` : ""}`,
        method: "GET",
      });

      if (response.status === 200) {
        setPublicUserData(response.message);
      }
    },
    [userName]
  );

  useEffect(() => {
    if (!userName) return;
    fetchPublicUserData(userName);
  }, [userName]);

  return (
    <ClubContext.Provider
      value={{
        publicUserData,
        setPublicUserData,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
