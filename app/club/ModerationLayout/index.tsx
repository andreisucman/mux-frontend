"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
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

  const showLoader = !publicUserData || !!code;

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      {header}
      {showLoader ? (
        <Loader
          m="auto"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      ) : (
        children
      )}
    </Stack>
  );
}
