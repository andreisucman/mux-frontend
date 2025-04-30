"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>();

  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const sort = searchParams.get("sort") || "-createdAt";
  const isMobile = useMediaQuery("(max-width: 36em)");

  const handleFetchProof = useCallback(
    async ({ part, sort, concern, currentArray, query, skip }: HandleFetchProofProps) => {
      try {
        const message = await fetchUsersProof({
          concern,
          part,
          query,
          sort,
          currentArrayLength: currentArray?.length || 0,
          skip,
        });

        const { data } = message || {};

        if (skip) {
          setProof([...(currentArray || []), ...data.slice(0, 20)]);
        } else {
          setProof(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      } catch (err) {}
    },
    [proof]
  );

  useEffect(() => {
    handleFetchProof({ part, sort, concern, query });
  }, [status, part, sort, concern, query]);

  useEffect(() => {
    getFilters({
      collection: "task",
      fields: ["part", "concern"],
    }).then((result) => {
      const { part, concern } = result;
      setAvailableParts(part);
      setAvailableConcerns(concern);
    });
  }, []);

  return (
    <Stack className={cn(classes.container, "mediumPage")}>
      <SkeletonWrapper>
        <PageHeader
          titles={individualResultTitles}
          disableFilter={!availableParts}
          disableSort={availableParts?.length === 0}
          filterNames={["part", "concern"]}
          sortItems={proofSortItems}
          defaultSortValue="-_id"
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
        {proof ? (
          <ProofGallery
            proof={proof}
            hasMore={hasMore}
            handleFetchProof={handleFetchProof}
            setProof={setProof}
            columns={isMobile ? 2 : 3}
            isSelf
          />
        ) : (
          <Loader
            m="0 auto"
            pt="30%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
