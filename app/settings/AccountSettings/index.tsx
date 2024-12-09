import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  IconArrowRight,
  IconAsterisk,
  IconCreditCard,
  IconDeviceFloppy,
  IconInfoCircle,
  IconSquareCheck,
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
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { UserDataType } from "@/types/global";
import classes from "./AccountSettings.module.css";

export default function AccountSettings() {
  const router = useRouter();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const isMobile = useMediaQuery("(max-width: 36em)");
  const emailChangeModalsStack = useModalsStack(["changeEmail", "confirmNewEmail"]);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, deleteOn, email: currentEmail, auth } = userDetails || {};

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
        router.push(response.message);
      }
    } catch (err) {
      console.log("Error in redirectToBillingPortal: ", err);
    }
  }, []);

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
    } catch (err) {
      console.log("Error in deleteAccount: ", err);
    }
  };

  const sendConfirmationCode = async () => {
    try {
      emailChangeModalsStack.open("changeEmail");
      await callTheServer({ endpoint: "sendConfirmationCode", method: "POST" });
    } catch (err) {
      console.log("Error in sendConfirmationCode: ", err);
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
      console.log("Error in handleChangeEmailStepOne: ", err);
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
        openSuccessModal({ description: response.message });
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

  useEffect(() => {
    if (!userId) return;
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, [userId]);

  return (
    <Skeleton visible={showSkeleton}>
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
                    onConfirm: () => sendConfirmationCode(),
                  })
                }
              >
                <IconDeviceFloppy className="icon" />{" "}
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
        <Stack align="center">
          <Text>We've sent a confirmation code to {email}. Enter it to continue.</Text>
          <PinInput length={5} size={isMobile ? "md" : "lg"} onChange={setConfirmationCode} />
          <Button
            loading={isLoading}
            disabled={confirmationCode.length < 5 || isLoading}
            onClick={() => handleChangeEmailStepTwo(confirmationCode, email)}
          >
            Finish
            <IconArrowRight className={"icon"} style={{ marginLeft: rem(8) }} />
          </Button>
        </Stack>
      </Modal>
    </Skeleton>
  );
}
