import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter as useDefaultRouter, usePathname, useSearchParams } from "next/navigation";
import { Group, Overlay, SegmentedControl, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import JoinClubConfirmation from "@/app/club/join/JoinClubConfirmation";
import PricingCard from "@/components/PricingCard";
import { UserContext } from "@/context/UserContext";
import { peekLicenseContent } from "@/data/pricingData";
import createCheckoutSession from "@/functions/createCheckoutSession";
import joinClub from "@/functions/joinClub";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import { PurchaseOverlayDataType } from "@/types/global";
import classes from "./PeekOverlay.module.css";

type Props = {
  purchaseOverlayData: PurchaseOverlayDataType[];
  userName: string;
};

export default function PeekOverlay({ purchaseOverlayData, userName }: Props) {
  const router = useRouter();
  const defaultRouter = useDefaultRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [selectedCardData, setSelectedCardData] = useState<PurchaseOverlayDataType>(
    purchaseOverlayData[0]
  );
  const { _id: userId, club } = userDetails || {};

  const part = searchParams.get("part");

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
      let parts = pathname.split("/").filter((p) => p);
      parts.pop();

      const redirectPath = "/" + parts.join("/");

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
      return;
    }

    if (!club) {
      modals.openContextModal({
        centered: true,
        modal: "general",
        innerProps: (
          <JoinClubConfirmation
            handleJoinClub={handleJoinClub}
            description="To buy a routine you have to join the Club first."
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

  const handleChangeCard = (part: string) => {
    const query = modifyQuery({ params: [{ name: "part", value: part, action: "replace" }] });
    defaultRouter.replace(`${pathname}?${query}`);
    const relevantData = purchaseOverlayData.find((o) => o.part === part);
    if (!relevantData) return;
    setSelectedCardData(relevantData);
  };

  const segments = useMemo(() => {
    return purchaseOverlayData.map((obj, i) => {
      const label = upperFirst(obj.part);
      return {
        label,
        value: obj.part,
      };
    });
  }, [purchaseOverlayData]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <PricingCard
          price={
            <Group className="priceGroup">
              <Title order={3}>${selectedCardData.oneTimePrice}</Title>
            </Group>
          }
          headerChildren={
            segments.length > 1 ? (
              <SegmentedControl
                data={segments}
                value={part || selectedCardData.part}
                className={classes.segmentedControl}
                onChange={handleChangeCard}
              />
            ) : (
              <></>
            )
          }
          name={selectedCardData.name}
          description={selectedCardData.description}
          buttonText="Buy routine"
          content={peekLicenseContent}
          onClick={handleAddSubscription}
          isLoading={isLoading}
          addGradient
        />
      </Stack>

      <Overlay color="#000" backgroundOpacity={0.1} blur={7} radius={16} />
    </Stack>
  );
}
