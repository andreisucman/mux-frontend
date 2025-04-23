import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter as useDefaultRouter, usePathname, useSearchParams } from "next/navigation";
import { Button, Group, Overlay, rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import JoinClubConfirmation from "@/app/club/join/JoinClubConfirmation";
import FilterDropdown from "@/components/FilterDropdown";
import PricingCard from "@/components/PricingCard";
import { UserContext } from "@/context/UserContext";
import { generalPlanContent } from "@/data/pricingData";
import createCheckoutSession from "@/functions/createCheckoutSession";
import joinClub from "@/functions/joinClub";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import { normalizeString } from "@/helpers/utils";
import { PurchaseOverlayDataType, UserDataType } from "@/types/global";
import PurchaseConfirmationModal from "./PurchaseConfirmationModal";
import RoutineDescriptionModal from "./RoutineDescriptionModal";
import RoutineStats from "./RoutineStats";
import classes from "./PurchaseOverlay.module.css";

type Props = {
  purchaseOverlayData: PurchaseOverlayDataType[];
  notPurchasedParts: string[];
  userName: string;
  handleCloseOverlay: () => void;
};

const getReferrer = (pathname: string) => {
  if (pathname.includes("/club/routines")) {
    return ReferrerEnum.CLUB_ROUTINES;
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
};

export default function PurchaseOverlay({
  purchaseOverlayData,
  userName,
  notPurchasedParts,
  handleCloseOverlay,
}: Props) {
  const defaultRouter = useDefaultRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [selectedCardData, setSelectedCardData] = useState<PurchaseOverlayDataType>();
  const { _id: userId, club } = userDetails || {};

  const concern = searchParams.get("concern");

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const handleJoinClub = useCallback(async () => {
    if (!selectedCardData) return;

    const clubData = await joinClub();

    if (clubData) {
      setUserDetails((prev: UserDataType) => ({ ...prev, ...clubData }));
      createCheckoutSession({
        type: "connect",
        body: {
          dataId: selectedCardData._id,
          redirectUrl,
          cancelUrl: redirectUrl,
          mode: "payment",
        },
        setIsLoading,
        setUserDetails,
      });
      modals.closeAll();
    }
  }, [userDetails, selectedCardData, redirectUrl]);

  const handleAddSubscription = useCallback(
    async (setIsLoading: any) => {
      if (status !== "authenticated") {
        let parts = pathname.split("/").filter((p) => p);
        parts.pop();

        const redirectPath = "/" + parts.join("/");

        const referrer = getReferrer(redirectPath);

        const params = new URLSearchParams(searchParams);
        params.append("userName", userName);

        openAuthModal({
          stateObject: {
            referrer,
            redirectPath,
            redirectQuery: params.toString(),
            localUserId: userId,
          },
          title: "Start your change",
        });
        return;
      }

      if (!club?.isActive) {
        modals.openContextModal({
          centered: true,
          modal: "general",
          classNames: { overlay: "overlay" },
          innerProps: (
            <JoinClubConfirmation
              handleJoinClub={handleJoinClub}
              description="To buy a routine you need to join the Club."
              type="confirm"
            />
          ),
          title: (
            <Title order={5} component={"p"}>
              Join the Club to continue
            </Title>
          ),
        });
        return;
      }

      handleOpenSubscriptionConfirmation(setIsLoading);
    },
    [userId, redirectUrl, status, selectedCardData]
  );

  const handleOpenSubscriptionConfirmation = useCallback(
    async (setIsLoading: any) => {
      modals.openContextModal({
        modal: "general",
        centered: true,
        classNames: { overlay: "overlay" },
        innerProps: (
          <PurchaseConfirmationModal
            onButtonClick={() => {
              modals.closeAll();
              return createCheckoutSession({
                type: "connect",
                body: {
                  dataId: selectedCardData?._id,
                  priceId: process.env.NEXT_PUBLIC_PEEK_PRICE_ID!,
                  redirectUrl,
                  cancelUrl: redirectUrl,
                  mode: "payment",
                },
                setIsLoading,
                setUserDetails,
              });
            }}
          />
        ),
        title: (
          <Title component={"p"} order={5}>
            Confirm purchase
          </Title>
        ),
      });
    },
    [selectedCardData, redirectUrl]
  );

  const handleChangeCard = (concern?: string | null) => {
    const query = modifyQuery({ params: [{ name: "concern", value: concern, action: "replace" }] });
    defaultRouter.replace(`${pathname}?${query}`);
    const relevantData = purchaseOverlayData.find((o) => o.concern === concern);
    if (!relevantData) return;
    setSelectedCardData(relevantData);
  };

  const segments = useMemo(() => {
    return purchaseOverlayData.map((obj, i) => {
      return {
        label: normalizeString(obj.concern),
        value: obj.concern,
      };
    });
  }, [purchaseOverlayData]);

  const controlledDescription = useMemo(() => {
    if (!selectedCardData) return;
    const intro = selectedCardData.description.slice(0, 150);
    const isLong = intro !== selectedCardData.description;

    return { intro: isLong ? `${intro}...` : intro, isLong };
  }, [selectedCardData]);

  const handleDescriptionClick = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      classNames: { overlay: "overlay" },
      innerProps: (
        <RoutineDescriptionModal
          text={selectedCardData?.description || ""}
          onButtonClick={handleOpenSubscriptionConfirmation}
        />
      ),
      title: (
        <Title component={"p"} order={5}>
          {selectedCardData?.name} - {userName}
        </Title>
      ),
    });
  }, [selectedCardData]);

  useEffect(() => {
    let selectedData;

    if (concern) {
      selectedData = purchaseOverlayData.find((obj) => obj.concern === concern);
    } else {
      const filteredPurchaseOverlayData = purchaseOverlayData.filter((o) =>
        notPurchasedParts.includes(o.concern)
      );
      selectedData = filteredPurchaseOverlayData[0];
    }
    setSelectedCardData(selectedData);
  }, [concern]);

  const jsx = (
    <Stack>
      {selectedCardData && <RoutineStats stats={selectedCardData.stats} />}
      {generalPlanContent.map((item, index) => (
        <Group wrap="nowrap" key={index} gap={12}>
          {item.icon}
          {item.description}
        </Group>
      ))}
    </Stack>
  );

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <PricingCard
          price={
            <Group className="priceGroup">
              <Title order={3}>${selectedCardData?.price}</Title>
            </Group>
          }
          headerChildren={
            segments.length > 1 ? (
              <FilterDropdown
                data={segments}
                selectedValue={concern || notPurchasedParts[0] || selectedCardData?.concern}
                placeholder="Select concern"
                onSelect={handleChangeCard}
                customStyles={{ marginLeft: "auto", maxWidth: "unset", marginBottom: rem(8) }}
              />
            ) : (
              <></>
            )
          }
          beforeButtonChild={
            <Button onClick={handleCloseOverlay} variant="outline" style={{ borderWidth: rem(2) }}>
              Preview
            </Button>
          }
          customHeadingStyles={{ padding: "1rem" }}
          name={selectedCardData?.name}
          description={
            <Text
              component="span"
              onClick={controlledDescription?.isLong ? handleDescriptionClick : undefined}
              style={controlledDescription?.isLong ? { cursor: "pointer" } : {}}
            >
              {controlledDescription?.intro}
            </Text>
          }
          buttonText="Buy routines"
          content={jsx}
          onClick={() => handleAddSubscription(setIsLoading)}
          isLoading={isLoading}
          addGradient
          glow
        />
      </Stack>
      <Overlay className={classes.overlay} backgroundOpacity={0.1} blur={7} radius={16} />
    </Stack>
  );
}
