"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import { HandleFetchDiaryProps } from "@/app/diary/page";
import { DiaryRecordType } from "@/app/diary/type";
import DiaryContent from "@/components/DiaryContent";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { PurchaseOverlayDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import useGetAvailablePartsAndConcerns from "../../routines/[[...userName]]/useGetAvailablePartsAndConcerns";
import classes from "./diary.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { userDetails, status: authStatus } = useContext(UserContext);
  const { name } = userDetails || {};
  const isSelf = userName === name;

  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const concern = searchParams.get("concern");
  const part = searchParams.get("part");

  const currentCombination = [part, concern].filter(Boolean).join("-");
  const isCurrentCombinationPurchased = !notPurchased.includes(currentCombination);

  const handleFetchDiaryRecords = useCallback(
    async ({ dateFrom, dateTo, concern, part, sort }: HandleFetchDiaryProps) => {
      const message = await fetchDiaryRecords({
        userName,
        sort,
        part,
        concern,
        dateFrom,
        dateTo,
        currentArrayLength: diaryRecords?.length,
        skip: hasMore,
      });

      const { priceData, data, notPurchased } = message || {};

      setPurchaseOverlayData(priceData ? priceData : null);

      if (message) {
        setNotPurchased(notPurchased);

        if (hasMore) {
          setDiaryRecords((prev) => [...(prev || []), ...data.slice(0, 20)]);
        } else {
          setDiaryRecords(data.slice(0, 20));
        }
        setOpenValue(data[0]?._id);
        setHasMore(data.length === 9);
      }
    },
    [diaryRecords, hasMore, userName]
  );

  const manageOverlays = useCallback(() => {
    if (!diaryRecords || diaryRecords.length === 0) {
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
  }, [diaryRecords, notPurchased, isCurrentCombinationPurchased]);

  const handleCloseOverlay = useCallback(() => {
    if (isCurrentCombinationPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [isCurrentCombinationPurchased]);

  useEffect(() => {
    manageOverlays();
  }, [isCurrentCombinationPurchased]);

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords({ dateTo, dateFrom, sort, part, concern });
  }, [sort, concern, userName, dateFrom, dateTo, authStatus]);

  useGetAvailablePartsAndConcerns({
    purchaseOverlayData,
    setConcerns: setAvailableConcerns,
    setParts: setAvailableParts,
    userName,
  });

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    diaryRecords &&
    diaryRecords.length > 0;

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="diary"
          title={"Club"}
          userName={userName}
          sortItems={diarySortItems}
          defaultSortValue={"-_id"}
          filterNames={["dateFrom", "dateTo", "part", "concern"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
              childrenProps: {
                partFilterItems: availableParts,
                concernFilterItems: availableConcerns,
              },
            })
          }
          disableFilter={!availableParts && !availableConcerns}
          disableSort={noPartsAndConcerns}
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.content}>
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
        {diaryRecords ? (
          <>
            <DiaryContent
              diaryRecords={diaryRecords}
              openValue={openValue}
              setOpenValue={setOpenValue}
              hasMore={hasMore}
              handleFetchDiaryRecords={() =>
                handleFetchDiaryRecords({ dateFrom, dateTo, sort, part, concern })
              }
            />

            {showButton && (
              <MaximizeOverlayButton
                showOverlayComponent={showOverlayComponent}
                notPurchased={notPurchased}
                setShowOverlayComponent={setShowOverlayComponent}
              />
            )}
          </>
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
