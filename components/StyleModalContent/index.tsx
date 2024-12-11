import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import handleTrackUser from "@/functions/handleTrackUser";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import GlowingButton from "../GlowingButton";
import SliderComparisonCarousel from "../SliderComparisonCarousel";
import StyleIndicators from "./StyleIndicators";
import StyleVoting from "./StyleVoting";
import { SimpleStyleType } from "./types";
import classes from "./StyleModalContent.module.css";

type Props = {
  record: SimpleStyleType;
  showTrackButton?: boolean;
  setRecords: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function StyleModalContent({ record, showTrackButton, setRecords }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { subscriptions, club } = userDetails || {};
  const { followingUserId } = club || {};

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
    compareStyleName,
    votes,
    compareVotes,
  } = record;

  const isTracked = followingUserId === userId;

  const formattedCurrentDate = formatDate({ date: createdAt });
  const formattedCompareDate = formatDate({ date: compareDate });
  const hideVoting = styleName === compareStyleName;

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/style?followingUserId=${record.userId}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${pathname}?${searchParams.toString()}`;

  return (
    <Stack className={classes.container}>
      <Stack className={classes.content}>
        <SliderComparisonCarousel
          currentImages={[mainUrl.url || ""]}
          compareImages={[compareMainUrl.url || ""]}
          compareDate={formattedCompareDate}
          currentDate={formattedCurrentDate}
        />
        {!hideVoting && (
          <StyleVoting
            compareIcon={compareIcon}
            compareVotes={compareVotes}
            compareName={compareStyleName}
            votes={votes}
            styleName={styleName}
            styleIcon={styleIcon}
            styleId={styleId}
            setRecords={setRecords}
          />
        )}
      </Stack>
      <StyleIndicators title="Analysis" record={record as SimpleStyleType} />
      {showTrackButton && club && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            text={"Peek lifestyle"}
            addGradient={!isTracked}
            disabled={isTracked}
            icon={<IconEye className={"icon"} />}
            onClick={() =>
              handleTrackUser({
                router,
                status,
                redirectUrl,
                cancelUrl,
                clubData: club,
                followingUserId: record.userId,
                subscriptions,
                setUserDetails,
              })
            }
          />
        </div>
      )}
    </Stack>
  );
}
