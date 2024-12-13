"use client";

import React, { useContext } from "react";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import AuthForm from "./AuthForm";
import classes from "./auth.module.css";

export const runtime = "edge";

export default function AuthPage() {
  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <AuthForm stateObject={{ localUserId: userId, redirectPath: "/tasks" }} />
      </Stack>
    </Stack>
  );
}
