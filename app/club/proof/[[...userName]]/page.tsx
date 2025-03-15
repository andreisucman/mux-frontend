"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/ModerationLayout/PurchaseOverlay";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { PurchaseOverlayDataType } from "@/types/global";
import classes from "./proof.module.css";
import { proofSortItems } from "@/data/sortItems";

export const runtime = "edge";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubProof(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { status, userDetails } = useContext(UserContext);
  const { publicUserData } = useContext(ClubContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showPurchaseOverlay, setShowPurchaseOverlay] = useState(false);

  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sort = searchParams.get("sort");
  const concern = searchParams.get("concern");

  const { name, club } = userDetails || {};
  const { followingUserName } = club || {};
  const isSelf = name === userName;

  const handleFetchProof = useCallback(
    async ({ part, userName, sort, concern, currentArray, query, skip }: HandleFetchProofProps) => {
      const message = await fetchUsersProof({
        concern,
        part,
        query,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      const { priceData, data } = message;

      setPurchaseOverlayData(priceData ? priceData : null);
      setShowPurchaseOverlay(!!priceData);

      if (skip) {
        setProof([...(proof || []), ...data.slice(0, 20)]);
      } else {
        setProof(data.slice(0, 20));
      }
      setHasMore(data.length === 21);
    },
    []
  );

  useEffect(() => {
    handleFetchProof({ userName, sort, part, concern, query });
  }, [status, userName, part, sort, concern, query, followingUserName]);

  useEffect(() => {
    getFilters({ collection: "proof", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, []);

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="proof"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          sortItems={proofSortItems}
          isDisabled={!availableParts}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProofFilterCardContent,
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
      <Stack
        className={cn(classes.content, "scrollbar", {
          [classes.relative]: !showPurchaseOverlay,
        })}
      >
        {showPurchaseOverlay && purchaseOverlayData && (
          <PurchaseOverlay purchaseOverlayData={purchaseOverlayData} userName={userName} />
        )}
        {proof ? (
          <ProofGallery
            proof={proof}
            hasMore={hasMore}
            userName={userName}
            handleFetchProof={handleFetchProof}
            setProof={setProof}
            isSelf={isSelf}
            isPublicPage
            columns={2}
          />
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
