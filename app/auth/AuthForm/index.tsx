import React, { useCallback, useContext, useMemo, useState } from "react";
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
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";
import TosCheckbox from "@/components/TosCheckbox";
import { UserContext } from "@/context/UserContext";
import authenticate from "@/functions/authenticate";
import signIn, { State } from "@/functions/signIn";
import sendPasswordResetEmail from "@/functions/startPasswordReset";
import { useRouter } from "@/helpers/custom-router";
import getPasswordStrength from "@/helpers/getPasswordStrength";
import { validateEmail } from "@/helpers/utils";
import PasswordInputWithStrength from "./PasswordInputWithStrength";
import classes from "./AuthForm.module.css";

type Props = {
  stateObject?: State;
  showTos: boolean;
  formType: "login" | "registration";
  customStyles?: { [key: string]: any };
};

function openLegalBody() {
  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "md",
    title: (
      <Title order={5} component={"p"}>
        {"Terms of Service"}
      </Title>
    ),
    innerProps: (
      <Stack>
        <TermsLegalBody />
      </Stack>
    ),
  });
}

export default function AuthForm({ formType, stateObject, customStyles }: Props) {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userDetails, setStatus, setUserDetails } = useContext(UserContext);
  const { tosAccepted: contextTosAccepted = false } = userDetails || {};

  const [highlightTos, setHighlightTos] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(contextTosAccepted);

  const buttonText = useMemo(() => {
    const text = formType === "login" ? (showResetPassword ? "Reset" : "Sign in") : "Register";
    return upperFirst(text);
  }, [formType, showResetPassword]);

  const secondaryButtonText = showResetPassword ? "Return" : "Reset password";

  const title = useMemo(
    () =>
      formType === "login"
        ? showResetPassword
          ? "Password reset"
          : "Sign in to continue"
        : "Register to continue",
    [formType, showResetPassword]
  );

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

      if (formType === "registration") {
        if (!tosAccepted) {
          setHighlightTos(true);
          return;
        }
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
    [formType, showResetPassword, tosAccepted, password, email]
  );

  const disableSubmit = email.trim().length < 4 && showResetPassword;

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
          placeholder={formType === "login" ? "Enter your email" : "Enter an email"}
          value={email}
          error={emailError}
          onChange={handleEnterEmail}
        />

        {!showResetPassword && (
          <>
            {formType === "login" ? (
              <PasswordInput
                value={password}
                onChange={handleEnterPassword}
                placeholder={"Enter your password"}
                error={passwordError}
                required
              />
            ) : (
              <PasswordInputWithStrength
                password={password}
                passwordError={passwordError}
                handleEnterPassword={handleEnterPassword}
                withChecks
              />
            )}
          </>
        )}
        <Stack className={classes.footer}>
          {formType === "registration" && !contextTosAccepted && (
            <TosCheckbox
              highlightTos={highlightTos}
              tosAccepted={tosAccepted}
              setHighlightTos={setHighlightTos}
              setTosAccepted={setTosAccepted}
              openLegalBody={openLegalBody}
            />
          )}
          <Button type="submit" className={classes.button} disabled={disableSubmit}>
            <IconMail className="icon" style={{ marginRight: rem(8) }} /> {buttonText}
          </Button>
          {formType === "login" && (
            <UnstyledButton
              className={classes.secondaryButton}
              onClick={() => setShowResetPassword((prev) => !prev)}
            >
              {secondaryButtonText}
            </UnstyledButton>
          )}
        </Stack>
      </form>
    </Stack>
  );
}
