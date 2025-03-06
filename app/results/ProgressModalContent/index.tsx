import React, { useContext, useState } from "react";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BeforeAfterType } from "@/app/types";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import LineProgressIndicators from "../LineProgressIndicators";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: BeforeAfterType;
  isPublicPage?: boolean;
};

export default function ProgressModalContent({ record, isPublicPage }: Props) {
  const { userDetails } = useContext(UserContext);
  const isSelf = record.userId === userDetails?._id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { userName, images, initialImages, updatedAt, createdAt, isPublic, initialDate } = record;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: updatedAt || createdAt || new Date() });

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
      <LineProgressIndicators title="Progress" record={record} />
      {isPublicPage && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            loading={isLoading}
            disabled={isLoading}
            text={"Peek routine"}
            icon={<IconEye className={"icon"} style={{ marginRight: rem(6) }} />}
            onClick={handleRedirect}
          />
        </div>
      )}
    </Stack>
  );
}
