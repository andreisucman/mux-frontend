"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import PurchaseOverlay from "@/app/club/PurchaseOverlay";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { proofSortItems } from "@/data/sortItems";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { PurchaseOverlayDataType } from "@/types/global";
import MaximizeOverlayButton from "../../MaximizeOverlayButton";
import useGetAvailablePartsAndConcerns from "../../routines/[[...userName]]/useGetAvailablePartsAndConcerns";
import classes from "./proof.module.css";

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

  const { userDetails } = useContext(UserContext);
  const { publicUserData } = useContext(ClubContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [purchaseOverlayData, setPurchaseOverlayData] = useState<
    PurchaseOverlayDataType[] | null
  >();
  const [showOverlayComponent, setShowOverlayComponent] = useState<
    "none" | "purchaseOverlay" | "maximizeButton" | "showOtherRoutinesButton"
  >("none");
  const [notPurchased, setNotPurchased] = useState<string[]>([]);

  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sort = searchParams.get("sort");
  const concern = searchParams.get("concern");

  const currentCombination = [part, concern].filter(Boolean).join("-");
  const isCurrentCombinationPurchased = !notPurchased.includes(currentCombination);

  const { name } = userDetails || {};
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

      const { priceData, data, notPurchased } = message || {};

      setPurchaseOverlayData(priceData ? priceData : null);
      setNotPurchased(notPurchased);

      if (skip) {
        setProof([...(proof || []), ...data.slice(0, 20)]);
      } else {
        setProof(data.slice(0, 20));
      }

      setHasMore(data.length === 21);
    },
    [proof]
  );

  const manageOverlays = useCallback(() => {
    if (!proof || proof.length === 0) {
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
  }, [proof, notPurchased, isCurrentCombinationPurchased]);

  const handleCloseOverlay = useCallback(() => {
    if (isCurrentCombinationPurchased) {
      setShowOverlayComponent("showOtherRoutinesButton");
    } else {
      setShowOverlayComponent("maximizeButton");
    }
  }, [isCurrentCombinationPurchased]);

  useEffect(() => {
    manageOverlays();
  }, [proof, notPurchased, isCurrentCombinationPurchased]);

  useEffect(() => {
    handleFetchProof({ userName, sort, part, concern, query });
  }, [userName, part, concern, sort, concern, query]);

  useGetAvailablePartsAndConcerns({
    purchaseOverlayData,
    setConcerns: setAvailableConcerns,
    setParts: setAvailableParts,
    userName,
  });

  const showButton =
    ["maximizeButton", "showOtherRoutinesButton"].includes(showOverlayComponent) &&
    proof &&
    proof.length > 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="proof"
          title={"Club"}
          userName={userName}
          filterNames={["part"]}
          sortItems={proofSortItems}
          defaultSortValue="-_id"
          isDisabled={!availableParts}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProofFilterCardContent,
              childrenProps: {
                partFilterItems: availableParts,
                concernFilterItems: availableConcerns,
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
      <Stack className={cn(classes.content, "scrollbar")}>
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
        {proof ? (
          <>
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
