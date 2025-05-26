import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  IconAsterisk,
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
} from "@tabler/icons-react";
import cn from "classnames";
import {
  ActionIcon,
  Alert,
  Button,
  Modal,
  PinInput,
  rem,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useModalsStack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import sendPasswordResetEmail from "@/functions/startPasswordReset";
import askConfirmation from "@/helpers/askConfirmation";
import Link from "@/helpers/custom-router/patch-router/link";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { UserDataType } from "@/types/global";
import classes from "./AccountSettings.module.css";

export default function AccountSettings() {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const emailChangeModalsStack = useModalsStack(["changeEmail", "confirmNewEmail"]);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { deleteOn, isPublic, email: currentEmail, auth, club } = userDetails || {};

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>(currentEmail || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const { payouts } = club || {};
  const { payoutsEnabled } = payouts || {};

  const isEmailDirty = currentEmail !== email.trim();

  const deleteAccount = async (isDelete: boolean) => {
    try {
      const response = await callTheServer({
        endpoint: "updateAccountDeletion",
        method: "POST",
        body: { isActivate: !isDelete },
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          deleteOn: response.message ? new Date(response.message) : response.message,
        }));
      }
    } catch (err) {}
  };

  const sendConfirmationCode = async () => {
    try {
      emailChangeModalsStack.open("changeEmail");
      await callTheServer({ endpoint: "sendConfirmationCode", method: "POST" });
    } catch (err) {
      openErrorModal();
    }
  };

  const handleChangeEmailStepOne = async (code: string, newEmail: string) => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "changeEmailStepOne",
        method: "POST",
        body: { code, newEmail },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        emailChangeModalsStack.close("changeEmail");
        emailChangeModalsStack.open("confirmNewEmail");
      }
    } catch (err) {
      openErrorModal();
    } finally {
      setConfirmationCode("");
      setIsLoading(false);
    }
  };

  const handleChangeEmailStepTwo = async (code: string, newEmail: string) => {
    if (newEmail === currentEmail) return;
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "changeEmailStepTwo",
        method: "POST",
        body: { code, newEmail },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        setUserDetails((prev: UserDataType) => ({ ...prev, email }));

        emailChangeModalsStack.close("confirmNewEmail");
        openInfoModal({ title: "✔️ Success!", description: response.message });
      }
    } catch (err) {
      openErrorModal();
    } finally {
      setConfirmationCode("");
      setIsLoading(false);
    }
  };

  const formattedDeleteOnDate = formatDate({ date: deleteOn || new Date() });

  useEffect(() => {
    if (!currentEmail) return;
    setEmail(currentEmail);
  }, [currentEmail]);

  const showSkeleton = useShowSkeleton();

  const privacyData = useMemo(() => {
    const color = isPublic ? "var(--mantine-color-green-4)" : "var(--mantine-color-red-4))";
    const iconColor = isPublic ? "var(--mantine-color-green-8)" : "var(--mantine-color-red-8))";
    const icon = isPublic ? (
      <IconEye
        size={18}
        stroke={1.5}
        style={{
          color: iconColor,
        }}
      />
    ) : (
      <IconEyeOff
        size={18}
        stroke={1.5}
        style={{
          color: iconColor,
        }}
      />
    );

    return { color, icon };
  }, [isPublic]);

  return (
    <Skeleton visible={showSkeleton} style={{ width: "unset" }}>
      <Stack className={classes.stack}>
        <Title order={2} fz={18}>
          Account
        </Title>
        {deleteOn && (
          <Alert p="0.5rem 1rem" styles={{ icon: { marginRight: rem(8) } }}>
            <Stack gap={8}>
              <Title order={5}>Warning!</Title>
              Your account is scheduled for deletion on {formattedDeleteOnDate}
              <Button ml="auto" onClick={() => deleteAccount(false)}>
                Cancel deletion
              </Button>
            </Stack>
          </Alert>
        )}
        <Stack className={classes.list}>
          <Alert
            icon={privacyData.icon}
            p="0.5rem 1rem"
            color={privacyData.color}
            styles={{ icon: { marginRight: rem(4) } }}
          >
            Your account is {isPublic ? "public" : "private"}
            {payoutsEnabled && (
              <Link className={classes.editLink} href="/club/publish-routines">
                Edit
              </Link>
            )}
          </Alert>
          <TextInput
            maw={425}
            value={email}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
            readOnly={auth === "g"}
            rightSection={
              <ActionIcon
                disabled={!isEmailDirty || !email}
                onClick={() =>
                  askConfirmation({
                    title: "Confirm email change",
                    body: "Start the email change?",
                    onConfirm: () => sendConfirmationCode(),
                  })
                }
              >
                <IconDeviceFloppy size={16} />{" "}
              </ActionIcon>
            }
          />
          <UnstyledButton
            className={cn(classes.item, { [classes.disabled]: auth !== "e" })}
            onClick={() =>
              askConfirmation({
                title: "Confirm reset password",
                body: "Start password reset?",
                onConfirm: () => sendPasswordResetEmail({ email }),
              })
            }
          >
            <IconAsterisk className={classes.icon} size={20} /> Reset password
          </UnstyledButton>
          {!deleteOn && (
            <UnstyledButton
              className={classes.item}
              onClick={() =>
                askConfirmation({
                  title: "Confirm delete",
                  body: "Delete account?",
                  onConfirm: () => deleteAccount(true),
                })
              }
            >
              <IconInfoCircle className={classes.icon} size={20} /> Delete account
            </UnstyledButton>
          )}
        </Stack>
      </Stack>
      <Modal
        {...emailChangeModalsStack.register("changeEmail")}
        title={
          <Title order={5} component={"p"}>
            Confirm current email
          </Title>
        }
        centered
      >
        <Stack align="center">
          <Text>We've sent a confirmation code to {currentEmail} email. Enter it to continue.</Text>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setConfirmationCode} />
          <Button
            loading={isLoading}
            disabled={confirmationCode.length < 5 || isLoading}
            onClick={() => handleChangeEmailStepOne(confirmationCode, email)}
          >
            Next
          </Button>
        </Stack>
      </Modal>
      <Modal
        {...emailChangeModalsStack.register("confirmNewEmail")}
        title={
          <Title order={5} component={"p"}>
            Confirm new email
          </Title>
        }
        centered
      >
        <Stack align="center">
          <Text>We've sent a confirmation code to {email}. Enter it to continue.</Text>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setConfirmationCode} />
          <Button
            loading={isLoading}
            disabled={confirmationCode.length < 5 || isLoading}
            onClick={() => handleChangeEmailStepTwo(confirmationCode, email)}
          >
            Finish
          </Button>
        </Stack>
      </Modal>
    </Skeleton>
  );
}
