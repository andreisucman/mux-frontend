import React, { useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import LineProgressIndicators from "../LineProgressIndicators";
import { HandleTrackProps } from "../proof/ProofGallery/type";
import { SimpleProgressType } from "../types";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: SimpleProgressType;
  handleTrack?: (props: HandleTrackProps) => void;
};

export default function ProgressModalContent({ record, handleTrack }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { trackedUserId } = club || {};

  const { userId, images, initialImages, createdAt, initialDate } = record;
  const isTracked = trackedUserId === userId;

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
      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek the routine"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={classes.icon} />}
            onClick={() =>
              handleTrack({ trackedUserId: record.userId, setUserDetails, subscriptions })
            }
          />
        </div>
      )}
    </Stack>
  );
}
