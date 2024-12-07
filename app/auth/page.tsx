"use client";

import React, { useContext } from "react";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import AuthForm from "./AuthForm";
import classes from "./auth.module.css";

export const runtime = "edge";

export default function AuthPage() {
  const { userDetails } = useContext(UserContext);
  const { tosAccepted, _id: userId } = userDetails || {};

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <AuthForm showTos={!tosAccepted} stateObject={{ localUserId: userId }} />
      </Stack>
    </Stack>
  );
}
