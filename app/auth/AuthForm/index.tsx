import "@mantine/core/styles/PasswordInput.layer.css";

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
import callTheServer from "@/functions/callTheServer";
import signIn, { State } from "@/functions/signIn";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { validateEmail, validatePassword } from "@/helpers/utils";
import classes from "./AuthForm.module.css";

type Props = {
  state?: State;
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

export default function AuthForm({ formType, state, customStyles }: Props) {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userDetails } = useContext(UserContext);
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
      await signIn({ router, state });
    } catch (err) {
      console.log("Error in authorize: ", err);
    }
  }, [typeof router, state]);

  const handleChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    if (emailError) setEmailError("");
    setEmail(e.currentTarget.value);
  };

  const handleChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
    if (passwordError) setPasswordError("");
    setPassword(e.currentTarget.value);
  };

  const handleStartPasswordReset = async (email: string) => {
    try {
      const response = await callTheServer({
        endpoint: "startPasswordReset",
        method: "POST",
        body: { email },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }
        openSuccessModal({ description: response.message });
      }
    } catch (err) {
      console.log("Error in handleSendResetPassword: ", err);
    }
  };

  const handleStartEmailRegistration = async (email: string, password: string) => {
    try {
      const response = await callTheServer({
        endpoint: "startEmailRegistration",
        method: "POST",
        body: {
          email,
          password,
        },
      });
    } catch (err) {}
  };

  const handleLoginWithEmail = async (email: string, password: string, state?: State) => {
    try {
      const response = await callTheServer({
        endpoint: "loginWithEmail",
        method: "POST",
        body: {
          email,
          password,
          state,
        },
      });

      if (response.status === 200) {
        const { redirectTo } = state || {};
        let redirectUrl;

        if (redirectTo) {
          redirectUrl = redirectTo;
        } else {
          redirectUrl = `/routine?type=head`;
        }

        router.push(redirectUrl);
      }
    } catch (err) {
      openErrorModal();
    }
  };

  const handleSubmitForm = useCallback(
    (e: React.FormEvent, state?: State) => {
      e.preventDefault();

      const emailValid = validateEmail(email);

      if (!emailValid) {
        setEmailError("The email format is invalid");
        return;
      }

      if (formType === "login") {
        if (showResetPassword) {
          if (!email.trim()) return;
          handleStartPasswordReset(email);
        } else {
          const passwordValid = validateEmail(password);

          if (!passwordValid) {
            setEmailError("The password format is invalid");
            return;
          }
          handleLoginWithEmail(email, password, state);
        }
      }

      if (formType === "registration") {
        console.log("entered here", tosAccepted);
        if (!tosAccepted) {
          setHighlightTos(true);
          return;
        }
        if (!email.trim() || !password || !password.trim()) return;
        const passwordValid = validatePassword(password);
        if (!passwordValid) {
          setPasswordError("The password format is invalid");
          return;
        }
        handleStartEmailRegistration(email, password);
      }
    },
    [formType, showResetPassword, tosAccepted, password, email]
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
          placeholder={formType === "login" ? "Enter your email" : "Enter an email"}
          value={email}
          error={emailError}
          onChange={handleChangeEmail}
        />

        {!showResetPassword && (
          <PasswordInput
            value={password}
            onChange={handleChangePassword}
            placeholder={formType === "login" ? "Enter your password" : "Create a password"}
            error={passwordError}
            required
          />
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
          <Button type="submit" className={classes.button}>
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
