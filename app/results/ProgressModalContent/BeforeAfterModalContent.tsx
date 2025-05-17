import React, { useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconEye } from "@tabler/icons-react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { BeforeAfterType } from "@/app/types";
import GlowingButton from "@/components/GlowingButton";
import SliderComparisonCarousel from "@/components/SliderComparisonCarousel";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import classes from "./ProgressModalContent.module.css";

type Props = {
  record: BeforeAfterType;
  isPublicPage?: boolean;
};

export default function BeforeAfterModalContent({ record, isPublicPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const isSelf = record.userId === userDetails?._id;

  const { userName, images, initialImages, part, concern, updatedAt, isPublic, initialDate } =
    record;

  const formattedInitialDate = formatDate({ date: initialDate });
  const formattedCompareDate = formatDate({ date: updatedAt || new Date() });

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/routines/${userName}`;

  const handleRedirect = () => {
    if (isLoading) return;
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("part", part);
    newParams.set("concern", concern);
    const query = newParams.toString();
    router.push(`${redirectUrl}${query ? `?${query}` : ""}`);
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
      {isPublicPage && (
        <div className={classes.buttonWrapper}>
          <GlowingButton
            loading={isLoading}
            disabled={isLoading}
            text={"See routines"}
            containerStyles={{ maxWidth: rem(325) }}
            icon={<IconEye size={20} style={{ marginRight: rem(6) }} />}
            onClick={handleRedirect}
          />
        </div>
      )}
    </Stack>
  );
}
