"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton, Stack } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import classes from "./ClubModerationLayout.module.css";

export const runtime = "edge";

type Props = {
  children: React.ReactNode;
  header: React.ReactNode;
};

export default function ClubModerationLayout({ children, header }: Props) {
  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);

  const code = searchParams.get("code");

  return (
    <Stack className={`${classes.container} smallPage`}>
      {header}
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={!publicUserData || !!code}>
        {children}
      </Skeleton>
    </Stack>
  );
}
