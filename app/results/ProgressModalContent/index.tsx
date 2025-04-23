import React, { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import LineProgressIndicators from "../LineProgressIndicators";
import { SimpleProgressType } from "../types";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: SimpleProgressType;
  isPublicPage?: boolean;
};

export default function ProgressModalContent({ record, isPublicPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const concern = searchParams.get("concern");
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const isSelf = record.userId === userDetails?._id;

  const {
    userName,
    concernScores,
    concernScoresDifference,
    images,
    initialImages,
    createdAt,
    isPublic,
    initialDate,
  } = record;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: createdAt || new Date() });

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/routines/${userName}`;

  const handleRedirect = () => {
    if (isLoading) return;
    setIsLoading(true);
    router.push(redirectUrl);
    modals.closeAll();
  };

  const filteredScores = concern
    ? concernScores.filter((obj) => obj.name === concern)
    : concernScores;

  const filteredDifferences = concern
    ? concernScoresDifference.filter((obj) => obj.name === concern)
    : concernScoresDifference;

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
      <LineProgressIndicators title="Improvement" concernScores={filteredScores} concernScoresDifference={filteredDifferences} />
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
