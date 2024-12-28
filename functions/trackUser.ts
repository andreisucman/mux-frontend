import React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ClubDataType, UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type TrackUserProps = {
  userName?: string | string[];
  redirectUrl: string;
  router: AppRouterInstance;
  clubData?: ClubDataType;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};
export default async function followUser({
  router,
  userName,
  redirectUrl,
  clubData,
  setUserDetails,
}: TrackUserProps) {
  try {
    const response = await callTheServer({
      endpoint: "followUser",
      method: "POST",
      body: { followingUserName: userName },
    });

    if (response.status === 200) {
      if (response.error) return;

      if (clubData) {
        const newClub = { ...clubData, followingUserName: userName };
        setUserDetails((prev) => ({ ...prev, newClub }));
      }
    }
  } catch (err) {
    console.log("Error in followUser: ", err);
  } finally {
    router.push(redirectUrl);
  }
}
