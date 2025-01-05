import React, { useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconCirclePlus } from "@tabler/icons-react";
import { rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import PricingCard from "@/app/plans/PricingCard";
import { peekLicenseContent } from "@/app/plans/pricingData";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import joinClub from "@/functions/joinClub";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import JoinClubConfirmation from "../../join/JoinClubConfirmation";
import classes from "./PeekOverlay.module.css";

type Props = {
  description?: string;
  userName?: string;
};

export default function PeekOverlay({ description, userName }: Props) {
  const router = useRouter();
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

  const handleAddSubscription = useCallback(async () => {
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
      modals.openContextModal({
        centered: true,
        modal: "general",
        innerProps: (
          <JoinClubConfirmation
            handleJoinClub={handleJoinClub}
            description="To get the Peek license you have to join the Club first. Here's what you need to know."
            type="confirm"
          />
        ),
        title: (
          <Title order={5} component={"p"}>
            Join the Club to continue
          </Title>
        ),
      });
      setIsLoading(false);
      return;
    }

    createCheckoutSession({
      priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
      redirectUrl,
      cancelUrl: redirectUrl,
      setUserDetails,
    });
  }, [userId, isLoading, redirectUrl, status]);

  const handleJoinClub = useCallback(async () => {
    const isSuccess = await joinClub({
      router,
      setUserDetails,
      redirectPath: null,
      closeModal: true,
    });

    if (isSuccess) {
      createCheckoutSession({
        priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
        redirectUrl,
        cancelUrl: redirectUrl,
        setUserDetails,
      });
    }
  }, [userDetails, redirectUrl]);

  return (
    <Stack className={classes.container}>
      {description && <Text className={classes.text}>{description}</Text>}
      <PricingCard
        price="19"
        name={"Peek License"}
        buttonText="Add"
        content={peekLicenseContent}
        onClick={handleAddSubscription}
        icon={<IconCirclePlus className="icon" style={{ marginRight: rem(6) }} />}
        isLoading={isLoading}
        addGradient
      />
    </Stack>
  );
}
