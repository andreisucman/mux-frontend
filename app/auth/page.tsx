"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Button, rem, Stack, Title } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import callTheServer from "@/functions/callTheServer";
import classes from "./auth.module.css";

export const runtime = "edge";

export default function AuthPage() {
  const router = useRouter();

  async function onSocialSignUpClick() {
    try {
      const response = await callTheServer({
        endpoint: "authorize",
        method: "GET",
      });

      if (response.status === 200) {
        router.push(response.message);
      }
    } catch (err) {
      console.log("Error in authorize: ", err);
    }
  }
  return (
    <Stack className={classes.container}>
      <Stack className={classes.content}>
        <Title className={classes.title} order={1}>
          Sign in to continue
        </Title>
        <Button onClick={onSocialSignUpClick} className={classes.button}>
          <IconBrandGoogle className="icon" style={{ marginRight: rem(4) }} />
          Sign in
        </Button>
        {/* <GlowingButton
          text="Sign in"
          onClick={onSocialSignUpClick}
          icon={<IconBrandGoogle className="icon" />}
          containerStyles={{ width: "100%", maxWidth: rem(300), margin: "0 auto", flex: 0 }}
        /> */}
      </Stack>
    </Stack>
  );
}
