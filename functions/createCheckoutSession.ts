import React from "react";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import fetchUserData from "./fetchUserData";

type Props = {
  body: { [key: string]: any };
  type: "platform" | "connect";
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default async function createCheckoutSession({
  type,
  body,
  setUserDetails,
  setIsLoading,
}: Props) {
  const endpoint = type === "platform" ? "createCheckoutSession" : "createRoutineCheckoutSession";
  const response = await callTheServer({
    endpoint,
    method: "POST",
    body,
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error });
      if (setIsLoading) setIsLoading(false);
      return;
    }

    const { redirectUrl, subscriptionId } = response.message;

    if (redirectUrl) {
      location.replace(redirectUrl);
      return;
    }

    if (subscriptionId) {
      fetchUserData({ setUserDetails });
      modals.closeAll();
    }
  }
}
