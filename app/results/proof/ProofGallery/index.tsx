"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import SelectPartOrConcern from "@/app/club/routines/[[...userName]]/SelectPartOrConcern";
import { FilterItemType } from "@/components/FilterDropdown/types";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { FetchProofProps } from "@/functions/fetchProof";
import { SimpleProofType } from "../types";
import ProofCard from "./ProofCard";
import classes from "./ProofGallery.module.css";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

type Props = {
  hasMore: boolean;
  columns?: number;
  userName?: string | string[];
  isSelf?: boolean;
  isPublicPage?: boolean;
  proof?: SimpleProofType[];
  availableParts?: FilterItemType[];
  availableConcerns?: FilterItemType[];
  handleFetchProof: (args: HandleFetchProofProps) => void;
  setProof: React.Dispatch<React.SetStateAction<SimpleProofType[] | undefined>>;
};

export default function ProofGallery({
  proof,
  hasMore,
  columns,
  userName,
  isSelf,
  isPublicPage,
  availableParts,
  availableConcerns,
  setProof,
  handleFetchProof,
}: Props) {
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const query = searchParams.get("query");
  const sort = searchParams.get("sort") || "-createdAt";

  const modelObject = proof && proof[0];
  const appliedBlurType = modelObject?.mainUrl.name;

  const memoizedProofCard = useCallback(
    (props: any) => (
      <ProofCard
        data={props.data}
        key={props.index}
        setProof={setProof}
        isPublicPage={isPublicPage}
        showContentModerationButtons={!isPublicPage && isSelf}
      />
    ),
    [part, concern, isSelf, appliedBlurType]
  );

  return (
    <Stack className={classes.container}>
      {proof && proof.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader
                m="auto"
                color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
              />
            </Stack>
          }
          loadMore={() =>
            handleFetchProof({
              userName,
              currentArray: proof,
              concern,
              part,
              query,
              sort,
              skip: hasMore,
            })
          }
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            columnCount={columns || 1}
            columnGutter={12}
            render={memoizedProofCard}
            items={proof}
          />
        </InfiniteScroll>
      ) : (
        <SelectPartOrConcern
          partFilterItems={availableParts || []}
          concernFilterItems={availableConcerns || []}
        />
      )}
    </Stack>
  );
}
