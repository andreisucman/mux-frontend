import React from "react";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import fetchUserData from "./fetchUserData";

type Props = {
  redirectUrl?: string;
  cancelUrl?: string;
  priceId: string;
  mode?: "subscription" | "payment";
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};

export default async function createCheckoutSession({
  priceId,
  redirectUrl,
  cancelUrl,
  mode = "subscription",
  setUserDetails,
}: Props) {
  if (!priceId) return;

  try {
    const response = await callTheServer({
      endpoint: "createCheckoutSession",
      method: "POST",
      body: {
        priceId,
        redirectUrl,
        cancelUrl,
        mode,
      },
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
  } catch (err) {}
}
