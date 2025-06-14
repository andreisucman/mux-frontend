"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconHourglass } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import FilterDropdown from "@/components/FilterDropdown";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { partItems } from "@/components/PageHeader/data";
import UploadCard from "@/components/UploadCard";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import openResetTimerModal from "@/functions/resetTimer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import checkActionAvailability from "@/helpers/checkActionAvailability";
import { useRouter } from "@/helpers/custom-router";
import { partIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import { PartEnum, UserDataType } from "@/types/global";
import { UploadProgressProps } from "../select-part/types";
import classes from "./scan.module.css";

export const runtime = "edge";
const validParts = [PartEnum.FACE, PartEnum.HAIR, PartEnum.BODY];

export default function ScanProgress() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);

  const query = searchParams.toString();
  const part = searchParams.get("part") || PartEnum.FACE;
  const { _id: userId, nextScan } = userDetails || {};

  const { isActionAvailable, checkBackDate } = checkActionAvailability({
    part,
    nextAction: nextScan,
  });

  const nextScanText = useMemo(() => {
    return `You can scan your ${part} again after ${checkBackDate}.`;
  }, [part, checkBackDate]);

  const handleResetTimer = useCallback(() => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${query ? `?${query}` : ""}`;
    openResetTimerModal("scan", part, redirectUrl, setUserDetails);
  }, [query, part, setUserDetails]);

  const scanButtons = useMemo(() => {
    const nextUrl = `/analysis${query ? `?${query}` : ""}`;
    return (
      <Group mt={8} gap={12} pb="15%">
        {status === AuthStateEnum.AUTHENTICATED && (
          <Button flex={1} miw={175} variant="default" onClick={handleResetTimer}>
            Reset scan timer
          </Button>
        )}
        {!isActionAvailable && (
          <Button flex={1} miw={175} variant="default" onClick={() => router.replace(nextUrl)}>
            See latest analysis
          </Button>
        )}
      </Group>
    );
  }, [query, pathname, handleResetTimer]);

  const handleUpload = useCallback(
    async ({
      url,
      beforeImageUrl,
      part,
      blurDots,
      offsets,
      setDisplayComponent,
      onCompleteCb,
    }: UploadProgressProps) => {
      if (!userDetails || !url) return;

      let intervalId: NodeJS.Timeout;

      setDisplayComponent("loading");

      const totalDuration = Math.random() * 25000 + 25000;
      const updateInterval = 1000;
      const incrementValue = 100 / (totalDuration / 1000);

      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + incrementValue;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, updateInterval);

      const [originalImageUrl] = await uploadToSpaces({
        itemsArray: [url],
        mime: "image/jpeg",
      });

      if (originalImageUrl) {
        try {
          const updatedBlurDots = blurDots.map((dot) => {
            return {
              ...dot,
              originalHeight: dot.originalHeight / offsets.scaleHeight,
              originalWidth: dot.originalWidth / offsets.scaleWidth,
              x: dot.x / offsets.scaleWidth,
              y: dot.y / offsets.scaleHeight,
            };
          });

          const body = {
            userId,
            part,
            blurDots: updatedBlurDots,
            beforeImage: beforeImageUrl,
            image: originalImageUrl,
          };

          const response = await callTheServer({
            endpoint: "uploadProgress",
            method: "POST",
            body,
          });

          if (response.status === 200) {
            if (response.error) {
              if (response.error === "not similar") {
                openErrorModal({
                  description:
                    "Your current photo is too different from the previous. Click 'Overlay' in the top left and try to match the previous photo.",
                });
                return;
              }

              openErrorModal({
                description: response.error,
              });
              return;
            }

            if (response.message) {
              setProgress(100);
              setUserDetails((prev: UserDataType) => ({
                ...prev,
                toAnalyze: response.message,
              }));

              const lastImage = response.message[response.message.length - 1];

              onCompleteCb(lastImage);
            }
          } else {
            openErrorModal();
          }
        } catch (err: any) {
          openErrorModal();
        } finally {
          setDisplayComponent("preview");
          setProgress(0);
          clearInterval(intervalId);
        }
      }
    },
    [userDetails, setUserDetails]
  );

  useEffect(() => {
    if (!pageLoaded) return;
    const invalidPart = !validParts.includes(part as PartEnum);

    if (!userDetails || invalidPart) router.replace("/select-part");
  }, [userDetails, part, pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader
        title="Scan"
        children={
          <FilterDropdown
            selectedValue={part}
            data={partItems}
            icons={partIcons}
            onSelect={(part) =>
              router.push(part ? `/select-concerns?part=${part}` : "/select-part")
            }
            filterType="part"
            placeholder="Select part"
            addToQuery
          />
        }
      />
      <SkeletonWrapper>
        {isActionAvailable ? (
          <UploadCard part={part as PartEnum} progress={progress} handleUpload={handleUpload} />
        ) : (
          <OverlayWithText
            icon={<IconHourglass size={24} />}
            text={nextScanText}
            button={scanButtons}
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
