import React, { useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { UserDataType, UserSubscriptionsType } from "@/types/global";
import LineProgressIndicators from "../LineProgressIndicators";
import { SimpleProgressType } from "../types";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: SimpleProgressType;
  handleTrack?: (
    trackedUserId: string,
    setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>,
    subscriptions?: UserSubscriptionsType | null
  ) => void;
};

export default function ProgressModalContent({ record, handleTrack }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { trackedUserId } = club || {};

  const isTracked = trackedUserId === record.userId;

  return (
    <Stack className={classes.container}>
      <SliderComparisonCarousel progressRecord={record} />
      <LineProgressIndicators record={record} title="Progress: " />

      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek the routine"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={classes.icon} />}
            onClick={() => handleTrack(record.userId, setUserDetails, subscriptions)}
          />
        </div>
      )}
    </Stack>
  );
}
