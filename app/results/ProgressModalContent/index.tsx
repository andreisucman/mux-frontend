import React, { useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { SimpleBeforeAfterType } from "@/app/types";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
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
  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { followingUserName } = club || {};

  const { userName, images, initialImages, updatedAt, createdAt, initialDate } = record;
  const isTracked = followingUserName === userName;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: updatedAt || createdAt || new Date() });

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/progress/${userName}`;

  const handleRedirect = () => {
    router.push(redirectUrl);
    modals.closeAll();
  };

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
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleRedirect}
          />
        </div>
      )}
    </Stack>
  );
}
