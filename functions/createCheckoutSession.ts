import React from "react";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import fetchUserData from "./fetchUserData";

type Props = {
  redirectUrl?: string;
  cancelUrl?: string;
  priceId: string;
  cb?: (...args: any) => void;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};

export default async function createCheckoutSession({
  cb,
  priceId,
  redirectUrl,
  cancelUrl,
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
      },
    });

    if (response.status === 200) {
      const { redirectUrl, subscriptionId, subscriptions } = response.message;

      if (redirectUrl) {
        location.replace(redirectUrl);
        return;
      }

      if (subscriptionId) {
        fetchUserData({ setUserDetails });
        modals.closeAll();
      }

      if (cb) cb(subscriptions);
    }
  } catch (err) {}
}
