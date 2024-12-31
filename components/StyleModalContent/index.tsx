import React, { useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
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
  isPublicPage?: boolean;
  setRecords: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function StyleModalContent({ record, isPublicPage, setRecords }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    _id: styleId,
    compareMainUrl,
    mainUrl,
    createdAt,
    compareDate,
    styleIcon,
    userName,
    styleName,
    compareIcon,
    compareStyleName,
    votes,
    compareVotes,
  } = record;

  const formattedCurrentDate = formatDate({ date: createdAt });
  const formattedCompareDate = formatDate({ date: compareDate });
  const hideVoting = styleName === compareStyleName;

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/style/${userName}`;

  const handleRedirect = () => {
    if (isLoading) return;
    setIsLoading(true);
    router.push(redirectUrl);
    modals.closeAll();
  };

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
      {isPublicPage && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            loading={isLoading}
            disabled={isLoading}
            text={"Peek style"}
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleRedirect}
          />
        </div>
      )}
    </Stack>
  );
}
