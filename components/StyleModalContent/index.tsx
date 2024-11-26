import React, { useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import StyleSuggestionIndicators from "@/app/analysis/style/StyleSuggestionCard/StyleSuggestionIndicators";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import { UserDataType, UserSubscriptionsType } from "@/types/global";
import GlowingButton from "../GlowingButton";
import ImageCard from "../ImageCard";
import { SimpleStyleType } from "./types";
import classes from "./StyleModalContent.module.css";

type Props = {
  record: SimpleStyleType;
  handleTrack?: (
    trackedUserId: string,
    setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>,
    subscriptions?: UserSubscriptionsType | null
  ) => void;
};

export default function StyleModalContent({ record, handleTrack }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { subscriptions, club } = userDetails || {};
  const { trackedUserId } = club || {};

  const isTracked = trackedUserId === record.userId;
  const formattedDate = formatDate({ date: record.createdAt });

  return (
    <Stack className={classes.container}>
      <ImageCard
        date={formattedDate}
        image={record.mainUrl.url}
        datePosition="bottom-right"
        showDate
      />
      <StyleSuggestionIndicators
        record={record as SimpleStyleType}
        customStyles={{ padding: rem(16), gap: rem(4) }}
      />
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
