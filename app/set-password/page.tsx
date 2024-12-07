"use client";

import { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Button, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { clearCookies } from "@/helpers/cookies";
import { modals } from "@mantine/modals";
import { useRouter } from "@/helpers/custom-router";
import getPasswordStrength from "@/helpers/getPasswordStrength";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import PasswordInputWithStrength from "../auth/AuthForm/PasswordInputWithStrength";
import classes from "./set-password.module.css";

export default function SetPassword() {
  const { setUserDetails, setStatus } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const accessToken = searchParams.get("accessToken");
  const { score, requirement } = getPasswordStrength(password);

  const handleSignOut = useCallback(async () => {
    clearCookies();
    deleteFromLocalStorage("userDetails");
    setStatus("unauthenticated");
    setUserDetails(null);
    modals.closeAll();
    router.replace("/auth");
  }, []);

  const handleEnterPassword = (e: React.FormEvent<HTMLInputElement>) => {
    if (error) setError("");
    setPassword(e.currentTarget.value);
  };

  const handleSubmitSetPasswordForm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        if (score < 100) {
          setError(requirement);
          return;
        }

        const response = await callTheServer({
          endpoint: "setPassword",
          method: "POST",
          body: {
            password,
            accessToken,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({
              description: `Your access token is ${response.error}. Request a new password reset.`,
            });
            return;
          }

          openSuccessModal({
            description: response.message,
            onClose: handleSignOut,
          });
        }
      } catch (err) {
        console.log("Error in handleSubmitSetPasswordForm: ", err);
        openErrorModal();
      }
    },
    [accessToken, password]
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Stack className={classes.wrapper}>
        <Stack className={classes.content}>
          <Title order={1}>Set new password</Title>

          <form onSubmit={handleSubmitSetPasswordForm} className={classes.form}>
            <PasswordInputWithStrength
              password={password}
              passwordError={error}
              handleEnterPassword={handleEnterPassword}
            />

            <Button type="submit" className={classes.button} disabled={score < 100}>
              <IconDeviceFloppy className={`icon ${classes.icon}`} /> Save
            </Button>
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
}
