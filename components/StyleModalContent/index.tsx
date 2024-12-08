import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
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
    compareName,
    votes,
    compareVotes,
  } = record;

  const isTracked = followingUserId === userId;

  const formattedCurrentDate = formatDate({ date: createdAt });
  const formattedCompareDate = formatDate({ date: compareDate });

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/style?followingUserId=${record.userId}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${pathname}?${searchParams.toString()}`;

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
