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
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { PurchaseOverlayDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import classes from "./diary.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { userDetails, status: authStatus } = useContext(UserContext);
  const { name, _id: userId } = userDetails || {};
  const isSelf = userName === name;

  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const part = searchParams.get("part");

  const handleFetchDiaryRecords = useCallback(
    async ({ dateFrom, dateTo, part, sort }: HandleFetchDiaryProps) => {
      const message = await fetchDiaryRecords({
        userName,
        sort,
        part,
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
    const isCurrentPartPurchased = part && !notPurchased.includes(part);

    if (isCurrentPartPurchased) {
      if (notPurchased.length > 0) {
        setShowOverlayComponent("showOtherRoutinesButton");
      } else {
        setShowOverlayComponent("none");
      }
    } else if (notPurchased.length > 0) {
      setShowOverlayComponent("purchaseOverlay");
    }
  }, [part, notPurchased]);

  const handleCloseOverlay = useCallback(() => {
    const isCurrentPartPurchased = part && !notPurchased.includes(part);
    if (isCurrentPartPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [part, notPurchased]);

  useEffect(() => {
    manageOverlays();
  }, [part, notPurchased]);

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords({ dateTo, dateFrom, sort, part });
  }, [sort, part, userName, dateFrom, dateTo, authStatus]);

  useEffect(() => {
    if (!userId) return;

    getFilters({
      collection: "task",
      fields: ["part"],
      filter: [`userName=${userName}`],
    }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, [userId]);

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="diary"
          title={"Club"}
          userName={userName}
          sortItems={diarySortItems}
          defaultSortValue={"-_id"}
          filterNames={["dateFrom", "dateTo", "part"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
              childrenProps: { availableParts },
            })
          }
          isDisabled={!diaryRecords}
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
            {["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) && (
              <MaximizeOverlayButton
                showOverlayComponent={showOverlayComponent}
                notPurchased={notPurchased}
                setShowOverlayComponent={setShowOverlayComponent}
              />
            )}
          </>
        )}
        {diaryRecords ? (
          <DiaryContent
            diaryRecords={diaryRecords}
            openValue={openValue}
            setOpenValue={setOpenValue}
            hasMore={hasMore}
            handleFetchDiaryRecords={() =>
              handleFetchDiaryRecords({ dateFrom, dateTo, sort, part })
            }
          />
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
