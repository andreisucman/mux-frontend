"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconHourglass, IconMoodNeutral, IconWhirl } from "@tabler/icons-react";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import FilterDropdown from "@/components/FilterDropdown";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { partItems } from "@/components/PageHeader/data";
import UploadCard from "@/components/UploadCard";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router";
import { partIcons } from "@/helpers/icons";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import openPaymentModal from "@/helpers/openPaymentModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import { PartEnum, UserDataType } from "@/types/global";
import { UploadProgressProps } from "../select-part/types";
import classes from "./scan.module.css";

export const runtime = "edge";
const validParts = ["face", "hair"];

export default function ScanProgress() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const query = searchParams.toString();
  const part = searchParams.get("part") || "face";
  const { _id: userId, toAnalyze, nextScan } = userDetails || {};

  const { isScanAvailable, checkBackDate } = useCheckScanAvailability({
    part,
    nextScan,
  });

  const nextScanText = useMemo(() => {
    return `You can scan your ${part} again after ${checkBackDate}.`;
  }, [part, checkBackDate]);

  const handleResetTimer = useCallback(() => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${query ? `?${query}` : ""}`;

    openPaymentModal({
      title: `Reset ${part} scan`,
      price: (
        <Group className="priceGroup">
          <Title order={4}>$1</Title>/<Text>one time</Text>
        </Group>
      ),
      isCentered: true,
      modalType: "scan",
      buttonText: "Reset scan timer",
      description: `You can scan your ${part} for free once a week. If you want more you can reset the timer now.`,
      onClick: () =>
        createCheckoutSession({
          type: "platform",
          body: {
            mode: "payment",
            priceId: process.env.NEXT_PUBLIC_SCAN_PRICE_ID!,
            redirectUrl,
            cancelUrl: redirectUrl,
            part,
          },
          setUserDetails,
        }),
      onClose: () => fetchUserData({ setUserDetails }),
    });
  }, [query]);

  const scanButtons = useMemo(() => {
    if (status === AuthStateEnum.AUTHENTICATED) {
      return (
        <Group mt={8} gap={12}>
          <Button flex={1} miw={175} variant="default" onClick={handleResetTimer}>
            Reset scan timer
          </Button>
          <Button
            flex={1}
            miw={175}
            variant="default"
            onClick={() => router.replace(`/analysis?part=${part}`)}
          >
            See latest analysis
          </Button>
        </Group>
      );
    }
  }, [status, pathname, handleResetTimer]);

  const handleUpload = useCallback(
    async ({ url, beforeImageUrl, part, blurDots, offsets }: UploadProgressProps) => {
      if (!userDetails || !url) return;

      let intervalId: NodeJS.Timeout;

      setIsLoading(true);

      const totalDuration = Math.random() * 25000 + 15000;
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

          const response = await callTheServer({
            endpoint: "uploadProgress",
            method: "POST",
            body: {
              userId,
              part,
              blurDots: updatedBlurDots,
              beforeImage: beforeImageUrl,
              image: originalImageUrl,
            },
          });

          if (response.status === 200) {
            if (response.error) {
              if (response.error === "must login") {
                openAuthModal({
                  title: "Sign in to continue",
                  stateObject: {
                    referrer: ReferrerEnum.SCAN,
                    redirectPath: "/scan",
                    localUserId: userId,
                  },
                });
                return;
              }

              if (response.error === "not similar") {
                openErrorModal({
                  description:
                    "Your current photo is too different from the previous. Click 'Overlay previous' in the top left and try to match the previouss image when taking the new photo.",
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

              return lastImage;
            }
          } else {
            openErrorModal();
          }
        } catch (err: any) {
          openErrorModal();
        } finally {
          setIsLoading(false);
          setProgress(0);
          clearInterval(intervalId);
        }
      }
    },
    [userDetails, setUserDetails]
  );

  useEffect(() => {
    if (!pageLoaded) return;
    const invalidPart = !validParts.includes(part);

    if (!userDetails || invalidPart) router.replace("/select-part");
  }, [userDetails, part, pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
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
      <SkeletonWrapper show={!toAnalyze}>
        {isScanAvailable ? (
          <UploadCard
            part={part as PartEnum}
            progress={progress}
            isLoading={isLoading}
            handleUpload={handleUpload}
          />
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
