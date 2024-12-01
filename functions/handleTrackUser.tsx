import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { IconPlus } from "@tabler/icons-react";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { ClubDataType, UserDataType, UserSubscriptionsType } from "@/types/global";
import createCheckoutSession from "./createCheckoutSession";
import fetchUserData from "./fetchUserData";
import signIn from "./signIn";
import trackUser from "./trackUser";

export type TrackUserProps = {
  status: string;
  router: AppRouterInstance;
  clubData: ClubDataType;
  redirectPath: string;
  cancelPath: string;
  trackedUserId: string;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
  subscriptions?: UserSubscriptionsType | null;
};

const handleTrackUser = async ({
  trackedUserId,
  subscriptions,
  redirectPath,
  cancelPath,
  clubData,
  router,
  status,
  setUserDetails,
}: TrackUserProps) => {
  if (typeof window === "undefined") return;
  if (!trackedUserId) return;

  if (status === "authenticated") {
    const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions) || {};

    if (isSubscriptionActive) {
      trackUser({ router, setUserDetails, trackedUserId, clubData, redirectPath });
    } else {
      openSubscriptionModal({
        title: `Add the Peek License`,
        modalType: "peek",
        isCentered: true,
        price: "19",
        buttonText: "Add",
        buttonIcon: <IconPlus className="icon" />,
        onClick: () =>
          createCheckoutSession({
            priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
            redirectPath,
            cancelPath,
            setUserDetails,
            cb: (subscriptions) =>
              handleTrackUser({
                router,
                redirectPath,
                cancelPath,
                status,
                clubData,
                trackedUserId,
                setUserDetails,
                subscriptions,
              }),
          }),
        onClose: () => fetchUserData(setUserDetails),
      });
    }
  } else {
    signIn({ state: { redirectTo: "peek", trackedUserId }, router });
  }
};

export default handleTrackUser;
