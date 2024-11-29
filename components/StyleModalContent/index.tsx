import React, { useContext } from "react";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { HandleTrackProps } from "@/app/results/proof/ProofGallery/type";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import GlowingButton from "../GlowingButton";
import SliderComparisonCarousel from "../SliderComparisonCarousel";
import StyleIndicators from "./StyleIndicators";
import StyleVoting from "./StyleVoting";
import { SimpleStyleType } from "./types";
import classes from "./StyleModalContent.module.css";

type Props = {
  record: SimpleStyleType;
  handleTrack?: (props: HandleTrackProps) => void;
  setRecords: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function StyleModalContent({ record, handleTrack, setRecords }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { subscriptions, club } = userDetails || {};
  const { trackedUserId } = club || {};

  const {
    _id: styleId,
    compareMainUrl,
    mainUrl,
    createdAt,
    compareDate,
    userId,
    styleIcon,
    styleName,
    compareIcon,
    compareName,
    votes,
    compareVotes,
  } = record;

  const isTracked = trackedUserId === userId;

  const formattedCurrentDate = formatDate({ date: createdAt });
  const formattedCompareDate = formatDate({ date: compareDate });

  return (
    <Stack className={classes.container}>
      <SliderComparisonCarousel
        currentImages={[mainUrl.url || ""]}
        compareImages={[compareMainUrl.url || ""]}
        compareDate={formattedCompareDate}
        currentDate={formattedCurrentDate}
      />
      <StyleIndicators
        record={record as SimpleStyleType}
        customStyles={{ padding: rem(16), gap: rem(4) }}
      />
      <StyleVoting
        compareIcon={compareIcon}
        compareVotes={compareVotes}
        compareName={compareName}
        votes={votes}
        styleName={styleName}
        styleIcon={styleIcon}
        styleId={styleId}
        setRecords={setRecords}
      />
      {handleTrack && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek lifestyle"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={"icon"} />}
            onClick={() =>
              handleTrack({ trackedUserId: record.userId, setUserDetails, subscriptions })
            }
          />
        </div>
      )}
    </Stack>
  );
}
