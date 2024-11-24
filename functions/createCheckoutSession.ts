import React from "react";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";

type Props = {
  redirectPath?: string;
  cancelPath?: string;
  priceId: string;
  cb?: (...args: any) => void;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>;
};

export default async function createCheckoutSession({
  cb,
  priceId,
  redirectPath,
  cancelPath,
  setUserDetails,
}: Props) {
  if (!priceId) return;

  try {
    const redirectUrl = redirectPath
      ? `${window.location.origin}${redirectPath}`
      : window.location.href;
    const cancelUrl = redirectPath
      ? `${window.location.origin}${cancelPath}`
      : window.location.href;

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
        location.href = redirectUrl;
        return;
      }

      if (subscriptionId) {
        const userDataResponse = await callTheServer({
          endpoint: "getUserData",
          method: "GET",
        });

        if (userDataResponse.status === 200) {
          if (setUserDetails)
            setUserDetails((prev) => ({
              ...(prev || {}),
              ...userDataResponse.message,
            }));
        }
        modals.closeAll();
      }

      if (cb) cb(subscriptions);
    }
  } catch (err) {
    console.log("Error in createCheckoutSession: ", err);
  }
}
