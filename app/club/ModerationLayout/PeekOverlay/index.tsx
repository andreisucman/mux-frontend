import React, { useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { rem, Stack, Text } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import PricingCard from "@/app/plans/PricingCard";
import { peekLicenseContent } from "@/app/plans/pricingData";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import classes from "./PeekOverlay.module.css";
import { modals } from "@mantine/modals";

type Props = {
  description?: string;
  userName?: string;
};

export default function PeekOverlay({ description, userName }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, club } = userDetails || {};

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
      if (pathname.includes("/club/answers")) {
        return ReferrerEnum.CLUB_ANSWERS;
      }
      return ReferrerEnum.CLUB_ROUTINES;
    },
    [pathname]
  );

  const handleClickButton = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (status !== "authenticated") {
      const redirectPath =
        "/" +
        pathname
          .split("/")
          .filter((p) => p)
          .slice(0, 2)
          .join("/");

      const referrer = getReferrer(redirectPath);

      const params = [];

      if (userName) {
        params.push({ name: "userName", value: userName, action: "replace" });
      }

      const query = modifyQuery({ params }) || searchParams.toString();

      openAuthModal({
        stateObject: {
          referrer,
          redirectPath,
          redirectQuery: query,
          localUserId: userId,
        },
        title: "Start your change",
      });
      setIsLoading(false);
    }

    if (!club) {
      // modals.openContextModal({})
    }

    createCheckoutSession({
      priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
      redirectUrl,
      cancelUrl: redirectUrl,
      setUserDetails,
    });
  }, [userId, isLoading, status]);

  return (
    <Stack className={classes.container}>
      {description && <Text className={classes.text}>{description}</Text>}
      <PricingCard
        price="19"
        name={"Peek License"}
        buttonText="Add"
        content={peekLicenseContent}
        onClick={handleClickButton}
        icon={<IconPlus className="icon" style={{ marginRight: rem(6) }} />}
        isLoading={isLoading}
        addGradient
      />
    </Stack>
  );
}
