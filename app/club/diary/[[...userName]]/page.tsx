"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack, Title } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import { HandleFetchDiaryProps } from "@/app/diary/page";
import { ChatCategoryEnum, DiaryRecordType } from "@/app/diary/type";
import ChatWithModal from "@/components/ChatWithModal";
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
import classes from "./diary.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { userDetails } = useContext(UserContext);
  const { club, name, _id: userId } = userDetails || {};
  const { followingUserName } = club || {};
  const isSelf = userName === name;

  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [partFilters, setPartFilters] = useState<FilterItemType[]>([]);
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

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

      const { priceData, data } = message;

      setPurchaseOverlayData(priceData ? priceData : null);
      setShowPurchaseOverlay(!!priceData);

      if (hasMore) {
        setDiaryRecords((prev) => [...(prev || []), ...data.slice(0, 20)]);
      } else {
        setDiaryRecords(data.slice(0, 20));
      }
      setOpenValue(data[0]?._id);
      setHasMore(data.length === 9);
    },
    [diaryRecords, hasMore, userName]
  );

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords({ dateTo, dateFrom, sort, part });
  }, [sort, part, userName, followingUserName, dateFrom, dateTo]);

  useEffect(() => {
    if (!userId) return;

    getFilters({
      collection: "task",
      fields: ["part"],
      filter: [`userId=${userId}`],
    }).then((result) => {
      const { availableParts } = result;
      setPartFilters(availableParts);
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
          filterNames={["dateFrom", "dateTo", "part"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
              childrenProps: { partFilters },
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
        {showPurchaseOverlay && purchaseOverlayData && (
          <PurchaseOverlay purchaseOverlayData={purchaseOverlayData} userName={userName} />
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

      <ChatWithModal
        modalTitle={
          <Title order={5} component={"p"}>
            Chat about diary
          </Title>
        }
        chatCategory={ChatCategoryEnum.DIARY}
        openChatKey={ChatCategoryEnum.DIARY}
        dividerLabel="Chat about diary"
      />
    </ClubModerationLayout>
  );
}
