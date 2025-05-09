"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack, Title } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import ProgressGallery from "@/app/results/ProgressGallery";
import { SimpleProgressType } from "@/app/results/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { progressSortItems } from "@/data/sortItems";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import openResultModal from "@/helpers/openResultModal";
import { normalizeString } from "@/helpers/utils";
import { PurchaseOverlayDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import useGetAvailablePartsAndConcerns from "../../routines/[[...userName]]/useGetAvailablePartsAndConcerns";
import classes from "./progress.module.css";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubProgress(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const { status: authStatus, userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const sort = searchParams.get("sort");

  const { name } = userDetails || {};
  const isSelf = userName === name;

  const currentCombination = [part, concern].filter(Boolean).join("-");
  const isCurrentCombinationPurchased = !notPurchased.includes(currentCombination);

  const handleFetchProgress = useCallback(
    async ({ concern, currentArray, sort, userName, skip }: HandleFetchProgressProps) => {
      const message = await fetchProgress({
        concern,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      const { priceData, data, notPurchased } = message || {};

      setPurchaseOverlayData(priceData ? priceData : null);

      if (message) {
        setNotPurchased(notPurchased);

        if (skip) {
          setProgress([...(currentArray || []), ...data.slice(0, 20)]);
        } else {
          setProgress(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      }
    },
    [progress]
  );

  const handleContainerClick = useCallback(
    (data: SimpleProgressType) =>
      openResultModal({
        record: data,
        type: "progress",
        title: (
          <Title order={5} component={"p"}>
            {normalizeString(data.part)} progress
          </Title>
        ),
      }),
    []
  );

  const manageOverlays = useCallback(() => {
    if (!progress || progress.length === 0) {
      setShowOverlayComponent("none");
      return;
    }

    if (isCurrentCombinationPurchased) {
      if (notPurchased.length > 0) {
        setShowOverlayComponent("showOtherRoutinesButton");
      } else {
        setShowOverlayComponent("none");
      }
    } else if (notPurchased.length > 0) {
      setShowOverlayComponent("purchaseOverlay");
    }
  }, [progress, isCurrentCombinationPurchased, notPurchased]);

  const handleCloseOverlay = useCallback(() => {
    if (isCurrentCombinationPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [isCurrentCombinationPurchased]);

  useEffect(() => {
    manageOverlays();
  }, [progress, isCurrentCombinationPurchased, notPurchased]);

  useEffect(() => {
    handleFetchProgress({ concern, sort, userName });
  }, [authStatus, userName, sort, concern]);

  useGetAvailablePartsAndConcerns({
    purchaseOverlayData,
    setConcerns: setAvailableConcerns,
    setParts: setAvailableParts,
    userName,
  });

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    progress &&
    progress.length > 0;

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="progress"
          title={"Club"}
          userName={userName}
          filterNames={["part", "concern"]}
          defaultSortValue="-_id"
          disableFilter={!availableConcerns && !availableParts}
          disableSort={noPartsAndConcerns}
          sortItems={progressSortItems}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProgressFilterCardContent,
              childrenProps: {
                concernFilterItems: availableConcerns,
                partFilterItems: availableParts,
              },
            })
          }
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <MaximizeOverlayButton
        isDisabled={!showButton}
        showOverlayComponent={showOverlayComponent}
        notPurchased={notPurchased}
        setShowOverlayComponent={setShowOverlayComponent}
      />
      <Stack className={classes.wrapper}>
        {progress ? (
          <Stack
            className={cn(classes.content, "scrollbar", {
              [classes.unbound]: showOverlayComponent !== "purchaseOverlay",
            })}
          >
            {purchaseOverlayData && (
              <>
                {showOverlayComponent === "purchaseOverlay" && (
                  <PurchaseOverlay
                    userName={userName}
                    notPurchasedParts={notPurchased}
                    purchaseOverlayData={purchaseOverlayData}
                    handleCloseOverlay={handleCloseOverlay}
                  />
                )}
              </>
            )}
            <ProgressGallery
              progress={progress}
              hasMore={hasMore}
              isSelf={isSelf}
              handleContainerClick={handleContainerClick}
              handleFetchProgress={handleFetchProgress}
              setProgress={setProgress}
              isPublicPage
            />
          </Stack>
        ) : (
          <Loader
            m="0 auto"
            pt="30%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
