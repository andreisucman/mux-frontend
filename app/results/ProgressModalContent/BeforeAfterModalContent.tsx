import React, { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BeforeAfterType } from "@/app/types";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import LineProgressIndicators from "../LineProgressIndicators";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: BeforeAfterType;
  isPublicPage?: boolean;
};

export default function BeforeAfterModalContent({ record, isPublicPage }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const isSelf = record.userId === userDetails?._id;

  const {
    userName,
    concernScoreDifference,
    concernScore,
    images,
    initialImages,
    updatedAt,
    createdAt,
    isPublic,
    initialDate,
  } = record;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: updatedAt || new Date() });
  const dateInterval = useMemo(
    () => getReadableDateInterval(initialDate, updatedAt || new Date()),
    []
  );

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/routines/${userName}`;

  const handleRedirect = () => {
    if (isLoading) return;
    setIsLoading(true);
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
        isPublicPage={!!isPublicPage}
        isPublic={isPublic}
        isSelf={isSelf}
      />
      <LineProgressIndicators
        title={`Improvement (${dateInterval})`}
        concernScores={[concernScore]}
        concernScoresDifference={[concernScoreDifference]}
      />
      {isPublicPage && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            loading={isLoading}
            disabled={isLoading}
            text={"See routines"}
            containerStyles={{ maxWidth: rem(325) }}
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleRedirect}
          />
        </div>
      )}
    </Stack>
  );
}
