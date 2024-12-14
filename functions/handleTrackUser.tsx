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
  redirectUrl: string;
  cancelUrl: string;
  followingUserId: string;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
  subscriptions?: UserSubscriptionsType | null;
};

const handleTrackUser = async ({
  followingUserId,
  subscriptions,
  redirectUrl,
  cancelUrl,
  clubData,
  router,
  status,
  setUserDetails,
}: TrackUserProps) => {
  if (typeof window === "undefined") return;
  if (!followingUserId) return;

  if (status === "authenticated") {
    const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions) || {};

    if (isSubscriptionActive) {
      trackUser({ router, setUserDetails, followingUserId, clubData, redirectUrl });
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
            redirectUrl,
            cancelUrl,
            setUserDetails,
            cb: (subscriptions) =>
              handleTrackUser({
                router,
                redirectUrl,
                cancelUrl,
                status,
                clubData,
                followingUserId,
                setUserDetails,
                subscriptions,
              }),
          }),
        onClose: () => fetchUserData(setUserDetails),
      });
    }
  } else {
    signIn({
      stateObject: { redirectPath: `/club`, redirectQuery: `id=${followingUserId}` },
      router,
    });
  }
};

export default handleTrackUser;
