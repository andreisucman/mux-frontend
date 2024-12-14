"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import BlurChoicesProvider from "@/context/BlurChoicesContext";
import UploadPartsChoicesProvider from "@/context/UploadPartsChoicesContext";
import { UserContext } from "@/context/UserContext";

type Props = {
  children: React.ReactNode;
};

export default function ScanLayout({ children }: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  useEffect(() => {
    if (userId) return;
    router.replace("/scan");
  }, [userId]);
  return (
    <BlurChoicesProvider>
      <UploadPartsChoicesProvider>{children}</UploadPartsChoicesProvider>
    </BlurChoicesProvider>
  );
}
