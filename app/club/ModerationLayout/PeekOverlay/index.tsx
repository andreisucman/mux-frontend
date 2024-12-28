import React, { useCallback, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { rem, Stack, Text } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import PricingCard from "@/app/plans/PricingCard";
import { peekLicenseContent } from "@/app/plans/pricingData";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import openAuthModal from "@/helpers/openAuthModal";
import classes from "./PeekOverlay.module.css";

type Props = {
  description?: string;
};

export default function PeekOverlay({ description }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

  const getReferrer = useCallback(
    (pathname: string) => {
      if (pathname.includes("/club/routines")) {
        return ReferrerEnum.CLUB_ROUTINES;
      }
      if (pathname.includes("/club/about")) {
        return ReferrerEnum.CLUB_ABOUT;
      }
      if (pathname.includes("/club/diary")) {
        return ReferrerEnum.CLUB_DIARY;
      }
      if (pathname.includes("/club/progress")) {
        return ReferrerEnum.CLUB_PROGRESS;
      }
      if (pathname.includes("/club/proof")) {
        return ReferrerEnum.CLUB_PROOF;
      }
      return ReferrerEnum.CLUB_ROUTINES;
    },
    [pathname]
  );

  const handleClickButton = useCallback(async () => {
    if (status !== "authenticated") {
      const referrer = getReferrer(pathname);

      openAuthModal({
        stateObject: {
          referrer,
          redirectPath: pathname,
          redirectQuery: `?${searchParams.toString()}`,
          localUserId: userId,
        },
        title: "Start your change",
      });
    } else {
      createCheckoutSession({
        priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
        redirectUrl,
        cancelUrl: redirectUrl,
        setUserDetails,
      });
    }
  }, [userId, status]);

  return (
    <Stack className={classes.container}>
      {description && <Text className={classes.text}>{description}</Text>}
      <PricingCard
        buttonText="Add"
        content={peekLicenseContent}
        onClick={handleClickButton}
        icon={<IconPlus className="icon" style={{ marginRight: rem(6) }} />}
        price="19"
        name={"Peek License"}
        addGradient
      />
    </Stack>
  );
}
