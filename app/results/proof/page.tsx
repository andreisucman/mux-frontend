"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { proofSortItems } from "@/data/sortItems";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { individualResultTitles } from "../individualResultTitles";
import ProofGallery from "./ProofGallery";
import { SimpleProofType } from "./types";
import classes from "./proof.module.css";

export const runtime = "edge";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

export default function ResultsProof() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);

  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const sort = searchParams.get("sort") || "-createdAt";

  const handleFetchProof = useCallback(
    async ({ part, sort, concern, currentArray, query, skip }: HandleFetchProofProps) => {
      const data = await fetchUsersProof({
        concern,
        part,
        query,
        sort,
        currentArrayLength: currentArray?.length || 0,
        skip,
      });

      if (skip) {
        setProof([...(currentArray || []), ...data.slice(0, 20)]);
      } else {
        setProof(data.slice(0, 20));
      }
      setHasMore(data.length === 21);
    },
    []
  );

  useEffect(() => {
    handleFetchProof({ part, sort, concern, query });
  }, [status, part, sort, concern, query]);

  useEffect(() => {
    getFilters({ collection: "task", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, []);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <SkeletonWrapper>
        <PageHeader
          titles={individualResultTitles}
          isDisabled={availableParts.length === 0}
          filterNames={["part"]}
          sortItems={proofSortItems}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProofFilterCardContent,
              childrenProps: {
                filterItems: availableParts,
              },
            })
          }
          showReturn
        />
        {proof ? (
          <ProofGallery
            proof={proof}
            hasMore={hasMore}
            handleFetchProof={handleFetchProof}
            setProof={setProof}
            columns={3}
            isSelf
          />
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
