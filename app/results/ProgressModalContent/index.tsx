import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import { SimpleBeforeAfterType } from "@/app/types";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import handleTrackUser from "@/functions/handleTrackUser";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import LineProgressIndicators from "../LineProgressIndicators";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: SimpleBeforeAfterType;
  showTrackButton?: boolean;
};

export default function ProgressModalContent({ record, showTrackButton }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { followingUserId } = club || {};

  const { userId, images, initialImages, updatedAt, createdAt, initialDate } = record;
  const isTracked = followingUserId === userId;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: updatedAt || createdAt || new Date() });

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/progress?followingUserId=${followingUserId}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${pathname}?${searchParams.toString()}`;

  return (
    <Stack className={classes.container}>
      <SliderComparisonCarousel
        currentImages={images.map((imo) => imo.mainUrl.url || "") || []}
        compareImages={initialImages.map((imo) => imo.mainUrl.url || "") || []}
        compareDate={formattedInitialDate}
        currentDate={formattedCompareDate}
      />
      <LineProgressIndicators title="Progress" record={record} />
      {showTrackButton && club && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek the routine"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={"icon"} />}
            onClick={() =>
              handleTrackUser({
                router,
                status,
                clubData: club,
                redirectUrl,
                cancelUrl,
                followingUserId: record.userId,
                setUserDetails,
                subscriptions,
              })
            }
          />
        </div>
      )}
    </Stack>
  );
}
