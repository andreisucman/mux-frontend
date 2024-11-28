import { UserDataType, UserSubscriptionsType } from "@/types/global";

export type HandleTrackProps = {
  trackedUserId: string;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>;
  subscriptions?: UserSubscriptionsType | null;
};
