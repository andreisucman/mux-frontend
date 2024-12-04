"use client";

import React, { useCallback, useContext, useState } from "react";
import {
  IconArrowRight,
  IconAsterisk,
  IconCreditCard,
  IconDeviceFloppy,
  IconInfoCircle,
  IconSquareCheck,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Alert,
  Button,
  Modal,
  PinInput,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  useModalsStack,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import sendPasswordResetEmail from "@/functions/startPasswordReset";
import verifyEmail from "@/functions/verifyEmail";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { UserDataType } from "@/types/global";
import ClubSettings from "./ClubSettings";
import classes from "./settings.module.css";

type AskConfirmationProps = {
  title: string;
  body: string;
  onConfirm: () => void;
};

export default function Settings() {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const emailChangeModalsStack = useModalsStack(["changeEmail", "confirmNewEmail"]);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, deleteOn, club, email: currentEmail, auth } = userDetails || {};

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>(currentEmail || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const isEmailDirty = currentEmail !== email.trim();

  const redirectToBillingPortal = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "createBillingPortalSession",
        method: "POST",
      });

      if (response.status === 200) {
        window.location.href = response.message;
      }
    } catch (err) {
      console.log("Error in redirectToBillingPortal: ", err);
    }
  }, []);

  const deleteAccount = useCallback(
    async (isDelete: boolean) => {
      try {
        const response = await callTheServer({
          endpoint: "updateAccountDeletion",
          method: "POST",
          body: { isActivate: !isDelete },
        });

        if (response.status === 200) {
          if (userId) {
            setUserDetails((prev: UserDataType) => ({
              ...prev,
              deleteOn: new Date(response.message),
            }));
          }

          openSuccessModal({
            description: "Your account is scheduled for deletion after 30 days.",
          });
        }
      } catch (err) {
        console.log("Error in deleteAccount: ", err);
      }
    },
    [userId]
  );

  const askConfirmation = ({ title, body, onConfirm }: AskConfirmationProps) => {
    modals.openConfirmModal({
      title: (
        <Title order={5} component={"p"}>
          {title}
        </Title>
      ),
      centered: true,
      children: <Text>{body}</Text>,
      labels: { confirm: "Yes", cancel: "No" },
      onConfirm,
    });
  };

  const changeEmail = useCallback(
    async (code: string, newEmail: string) => {
      if (newEmail === currentEmail) return;
      if (isLoading) return;
      setIsLoading(true);

      try {
        const response = await callTheServer({
          endpoint: "changeEmail",
          method: "POST",
          body: { newEmail, code },
        });

        if (response.status === 200) {
          setUserDetails((prev: UserDataType) => ({ ...prev, email }));
          emailChangeModalsStack.close("changeEmail");
          emailChangeModalsStack.open("confirmNewEmail");
        }
      } catch (err) {
        openErrorModal();
      } finally {
        setConfirmationCode("");
        setIsLoading(false);
      }
    },
    [isLoading, currentEmail, emailChangeModalsStack]
  );

  const handleVerifyEmail = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    await verifyEmail({ code: confirmationCode });
    emailChangeModalsStack.close("confirmNewEmail");
    setIsLoading(false);
  }, [confirmationCode]);

  const formattedDeleteOnDate = formatDate({ date: deleteOn || new Date() });

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Settings" showReturn hidePartDropdown hideTypeDropdown />
      <Stack className={classes.content}>
        <Stack className={classes.stack}>
          <Title order={2} fz={18}>
            Account
          </Title>
          {deleteOn && (
            <Alert variant="light">
              <Stack gap={8}>
                <Title order={5}>Warning!</Title>
                Your account is scheduled for deletion on {formattedDeleteOnDate}
                <Button ml="auto" onClick={() => deleteAccount(false)}>
                  <IconSquareCheck className={`${classes.icon} icon`} /> Cancel deletion
                </Button>
              </Stack>
            </Alert>
          )}
          <Stack className={classes.list}>
            <TextInput
              maw={355}
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
                      onConfirm: () => emailChangeModalsStack.open("changeEmail"),
                    })
                  }
                >
                  <IconDeviceFloppy className="icon" />{" "}
                </ActionIcon>
              }
            />
            <UnstyledButton
              className={classes.item}
              onClick={() =>
                askConfirmation({
                  title: "Confirm reset password",
                  body: "Start password reset?",
                  onConfirm: () => sendPasswordResetEmail({ email }),
                })
              }
            >
              <IconAsterisk className={`${classes.icon} icon`} /> Reset password
            </UnstyledButton>
            <UnstyledButton
              className={classes.item}
              onClick={() =>
                askConfirmation({
                  title: "Confirm redirect",
                  body: "Go to the billing portal?",
                  onConfirm: () => redirectToBillingPortal(),
                })
              }
            >
              <IconCreditCard className={`${classes.icon} icon`} /> Manage subscriptions
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
                <IconInfoCircle className={`${classes.icon} icon`} /> Delete account
              </UnstyledButton>
            )}
          </Stack>
        </Stack>
        {club && <ClubSettings />}
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
        <Stack>
          <Text>We've sent a confirmation code to your current email. Enter it to continue.</Text>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setConfirmationCode} />
          <Button
            variant="default"
            flex={1}
            disabled={confirmationCode.length < 5}
            onClick={() => changeEmail(confirmationCode, email)}
          >
            Next <IconArrowRight className={"icon"} style={{ marginLeft: rem(8) }} />
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
        <Stack>
          <Text>We've sent a confirmation code to your new email. Enter it to continue.</Text>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setConfirmationCode} />
          <Button
            variant="default"
            flex={1}
            disabled={confirmationCode.length < 5}
            onClick={handleVerifyEmail}
          >
            <IconArrowRight className={"icon"} style={{ marginRight: rem(8) }} /> Finish
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
