import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import handleTrackUser from "@/functions/handleTrackUser";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import LineProgressIndicators from "../LineProgressIndicators";
import { SimpleProgressType } from "../types";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: SimpleProgressType;
  showTrackButton?: boolean;
};

export default function ProgressModalContent({ record, showTrackButton }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { followingUserId } = club || {};

  const { userId, images, initialImages, createdAt, initialDate } = record;
  const isTracked = followingUserId === userId;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: createdAt });

  return (
    <Stack className={classes.container}>
      <SliderComparisonCarousel
        currentImages={images.map((imo) => imo.mainUrl.url || "") || []}
        compareImages={initialImages.map((imo) => imo.mainUrl.url || "") || []}
        compareDate={formattedInitialDate}
        currentDate={formattedCompareDate}
      />
      <LineProgressIndicators record={record} />
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
                redirectPath: `/club/progress?followingUserId=${record.userId}`,
                cancelPath: `/${pathname}?${searchParams.toString()}`,
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
