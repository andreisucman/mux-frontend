import React, { useCallback, useContext, useState } from "react";
import { IconBrandGoogle, IconMail } from "@tabler/icons-react";
import {
  Button,
  PasswordInput,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import PrivacyLegalBody from "@/app/legal/privacy/PrivacyLegalBody";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";
import { UserContext } from "@/context/UserContext";
import authenticate from "@/functions/authenticate";
import signIn, { SignInStateType } from "@/functions/signIn";
import sendPasswordResetEmail from "@/functions/startPasswordReset";
import { useRouter } from "@/helpers/custom-router";
import getPasswordStrength from "@/helpers/getPasswordStrength";
import { validateEmail } from "@/helpers/utils";
import classes from "./AuthForm.module.css";

type Props = {
  stateObject?: SignInStateType;
  showTos: boolean;
  customStyles?: { [key: string]: any };
};

function openLegalBody(type: "privacy" | "terms") {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "md",
    title: (
      <Title order={5} component={"p"}>
        {"Terms of Service"}
      </Title>
    ),
    innerProps: <Stack>{type === "terms" ? <TermsLegalBody /> : <PrivacyLegalBody />}</Stack>,
  });
}

export default function AuthForm({ stateObject, customStyles }: Props) {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setStatus, setUserDetails } = useContext(UserContext);

  const title = showResetPassword ? "Password reset" : "Sign in to continue";
  const secondaryButtonText = showResetPassword ? "Return" : "Reset password";

  const onSocialButtonClick = useCallback(async () => {
    try {
      await signIn({ router, stateObject });
    } catch (err) {
      console.log("Error in authorize: ", err);
    }
  }, [typeof router, typeof stateObject]);

  const handleEnterEmail = (e: React.FormEvent<HTMLInputElement>) => {
    if (emailError) setEmailError("");
    setEmail(e.currentTarget.value);
  };

  const handleEnterPassword = (e: React.FormEvent<HTMLInputElement>) => {
    if (passwordError) setPasswordError("");
    setPassword(e.currentTarget.value);
  };

  const handleSubmitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const emailValid = validateEmail(email);

      if (!email.trim()) {
        setEmailError("The email field cannot be empty.");
        return;
      }

      if (!emailValid) {
        setEmailError("The email format is invalid.");
        return;
      }

      if (showResetPassword) {
        sendPasswordResetEmail({ email });
        return;
      }

      if (!password || !password.trim()) {
        setPasswordError("The password field cannot be empty.");
        return;
      }

      const { score, requirement } = getPasswordStrength(password);

      if (score < 100) {
        setPasswordError(requirement);
        return;
      }

      let state = null;

      if (stateObject) {
        state = encodeURIComponent(JSON.stringify(stateObject));
      }

      authenticate({
        state,
        router,
        setStatus,
        setUserDetails,
      });
    },
    [showResetPassword, password, email]
  );

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Title order={1} className={classes.title}>
        {title}
      </Title>
      {!showResetPassword && (
        <>
          <Button onClick={onSocialButtonClick} className={classes.button} variant="default">
            <IconBrandGoogle className="icon" style={{ marginRight: rem(4) }} />
            Sign in
          </Button>
          <Text c="dimmed" size="xs" ta="center">
            or using email...
          </Text>
        </>
      )}
      <form onSubmit={handleSubmitForm} className={classes.form}>
        <TextInput
          required
          placeholder={"Enter your email"}
          value={email}
          error={emailError}
          onChange={handleEnterEmail}
        />

        {!showResetPassword && (
          <>
            <PasswordInput
              value={password}
              onChange={handleEnterPassword}
              placeholder={"Enter your password"}
              error={passwordError}
              required
            />
          </>
        )}
        <Stack className={classes.footer}>
          <Text component="div" lineClamp={2} size="sm">
            By signing in, you accept our
            <Text onClickCapture={() => openLegalBody("privacy")} style={{ cursor: "pointer" }}>
              Privacy policy
            </Text>{" "}
            and
            <Text onClickCapture={() => openLegalBody("terms")} style={{ cursor: "pointer" }}>
              Terms of Service
            </Text>
          </Text>
          <Button type="submit" className={classes.button}>
            <IconMail className="icon" style={{ marginRight: rem(8) }} /> Sign in
          </Button>
          <UnstyledButton
            className={classes.secondaryButton}
            onClick={() => setShowResetPassword((prev) => !prev)}
          >
            {secondaryButtonText}
          </UnstyledButton>
        </Stack>
      </form>
    </Stack>
  );
}
