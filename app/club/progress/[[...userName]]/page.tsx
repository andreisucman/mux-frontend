"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
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
import { PurchaseOverlayDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
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
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const concern = searchParams.get("concern") || availableConcerns?.[0]?.value;
  const sort = searchParams.get("sort");

  const { name } = userDetails || {};

  const isSelf = userName === name;

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
            {upperFirst(data.part)} progress
          </Title>
        ),
      }),
    []
  );

  const manageOverlays = useCallback(() => {
    const isCurrentConcernPurchased = concern && !notPurchased.includes(concern);

    if (isCurrentConcernPurchased) {
      if (notPurchased.length > 0) {
        setShowOverlayComponent("showOtherRoutinesButton");
      } else {
        setShowOverlayComponent("none");
      }
    } else if (notPurchased.length > 0) {
      setShowOverlayComponent("purchaseOverlay");
    }
  }, [concern, notPurchased]);

  const handleCloseOverlay = useCallback(() => {
    const isCurrentConcernPurchased = concern && !notPurchased.includes(concern);
    if (isCurrentConcernPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [concern, notPurchased]);

  useEffect(() => {
    manageOverlays();
  }, [concern, notPurchased]);

  useEffect(() => {
    if (!concern) return;
    handleFetchProgress({ concern, sort, userName });
  }, [authStatus, userName, sort, concern]);

  useEffect(() => {
    if (!purchaseOverlayData || !userName) return;
    const availableConcerns = purchaseOverlayData.map((obj) => obj.concern);
    setAvailableConcerns(availableConcerns.map((p) => ({ value: p, label: upperFirst(p) })));
  }, [userName, purchaseOverlayData]);

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    progress &&
    progress.length > 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="progress"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          defaultSortValue="-_id"
          sortItems={progressSortItems}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProgressFilterCardContent,
              childrenProps: {
                filterItems: availableConcerns,
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
      <Stack className={classes.wrapper}>
        {progress ? (
          <Stack
            className={cn(classes.content, "scrollbar", {
              [classes.relative]: showOverlayComponent !== "purchaseOverlay",
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
              isPublicPage={false}
              isSelf={isSelf}
              handleContainerClick={handleContainerClick}
              handleFetchProgress={handleFetchProgress}
              setProgress={setProgress}
            />
            {showButton && (
              <MaximizeOverlayButton
                showOverlayComponent={showOverlayComponent}
                notPurchased={notPurchased}
                setShowOverlayComponent={setShowOverlayComponent}
              />
            )}
          </Stack>
        ) : (
          <Loader m="0 auto" pt="25%" />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
