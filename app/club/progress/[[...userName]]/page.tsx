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
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import openResultModal from "@/helpers/openResultModal";
import { PurchaseOverlayDataType } from "@/types/global";
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
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  const part = searchParams.get("part");
  const sort = searchParams.get("sort");

  const { name, club } = userDetails || {};
  const { followingUserName } = club || {};

  const isSelf = userName === name;

  const handleFetchProgress = useCallback(
    async ({ part, currentArray, sort, userName, skip }: HandleFetchProgressProps) => {
      const message = await fetchProgress({
        part,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      const { priceData, data } = message;

      setPurchaseOverlayData(priceData ? priceData : null);
      setShowPurchaseOverlay(!!priceData);

      if (skip) {
        setProgress([...(currentArray || []), ...data.slice(0, 20)]);
      } else {
        setProgress(data.slice(0, 20));
      }
      setHasMore(data.length === 21);
    },
    []
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

  useEffect(() => {
    handleFetchProgress({ part, sort, userName });
  }, [authStatus, userName, sort, part, followingUserName]);

  useEffect(() => {
    getFilters({ collection: "progress", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, []);

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="progress"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          sortItems={progressSortItems}
          isDisabled={!availableParts}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProgressFilterCardContent,
              childrenProps: {
                filterItems: availableParts,
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
              [classes.relative]: !showPurchaseOverlay,
            })}
          >
            {showPurchaseOverlay && purchaseOverlayData && (
              <PurchaseOverlay purchaseOverlayData={purchaseOverlayData} userName={userName} setShowPurchaseOverlay={setShowPurchaseOverlay} />
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
          </Stack>
        ) : (
          <Loader m="0 auto" pt="15%" />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
