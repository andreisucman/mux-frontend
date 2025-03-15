import React from "react";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import fetchUserData from "./fetchUserData";

type Props = {
  body: { [key: string]: any };
  type: "platform" | "connect";
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};

export default async function createCheckoutSession({ type, body, setUserDetails }: Props) {
  const endpoint = type === "platform" ? "createCheckoutSession" : "createConnectCheckoutSession";
  const response = await callTheServer({
    endpoint,
    method: "POST",
    body,
  });

  if (response.status === 200) {
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
