import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ClubDataType, UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type TrackUserProps = {
  followingUserId: string | null;
  redirectUrl: string;
  router: AppRouterInstance;
  clubData?: ClubDataType;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};
export default async function trackUser({
  router,
  followingUserId,
  redirectUrl,
  clubData,
  setUserDetails,
}: TrackUserProps) {
  try {
    const response = await callTheServer({
      endpoint: "trackUser",
      method: "POST",
      body: { followingUserId },
    });

    if (response.status === 200) {
      if (response.error) return;

      if (clubData) {
        const newClub = { ...clubData, followingUserId };
        setUserDetails((prev) => ({ ...prev, newClub }));
      }
    }
  } catch (err) {
    console.log("Error in trackUser: ", err);
  } finally {
    router.push(redirectUrl);
  }
}
