"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { protectedPaths } from "@/context/UserContext/protectedPaths";
import { AuthStateEnum } from "@/context/UserContext/types";

type Props = {
  children: React.ReactNode;
};

export default function SkeletonWrapper({ children }: Props) {
  const { status } = useContext(UserContext);
  const pathname = usePathname();
  const onProtectedPath = protectedPaths.includes(pathname);
  const showSkeleton = onProtectedPath && status !== AuthStateEnum.AUTHENTICATED;

  return (
    <Skeleton visible={!showSkeleton} className="skeleton">
      {children}
    </Skeleton>
  );
}
