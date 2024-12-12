"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { rem, Skeleton } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { protectedPaths } from "@/context/UserContext/protectedPaths";
import { AuthStateEnum } from "@/context/UserContext/types";

type Props = {
  children: React.ReactNode;
  show?: boolean;
};

export default function SkeletonWrapper({ children, show }: Props) {
  const pathname = usePathname();
  const { status } = useContext(UserContext);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const onProtectedPath = protectedPaths.includes(pathname);

  useEffect(() => {
    const showSkeleton = onProtectedPath && status !== AuthStateEnum.AUTHENTICATED;
    setShowSkeleton(showSkeleton);
  }, [status, onProtectedPath]);

  return (
    <Skeleton visible={show || showSkeleton} className="skeleton" style={{ gap: rem(16) }}>
      {children}
    </Skeleton>
  );
}
