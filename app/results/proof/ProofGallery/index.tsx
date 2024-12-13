"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
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
  isPublicPage?: boolean;
  proof?: SimpleProofType[];
  handleFetchProof: (args: HandleFetchProofProps) => void;
  setProof: React.Dispatch<React.SetStateAction<SimpleProofType[] | undefined>>;
};

export default function ProofGallery({
  proof,
  hasMore,
  columns,
  isPublicPage,
  setProof,
  handleFetchProof,
}: Props) {
  const { userDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const { _id: userId } = userDetails || {};

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const query = searchParams.get("query");
  const followingUserId = searchParams.get("followingUserId");
  const isSelf = !followingUserId || userId === followingUserId;

  const modelObject = proof && proof[0];
  const appliedBlurType = modelObject?.mainUrl.name;

  const memoizedStyleCard = useCallback(
    (props: any) => (
      <ProofCard
        data={props.data}
        key={props.index}
        isMobile={!!isMobile}
        setProof={setProof}
        isPublicPage={isPublicPage}
        showContentBlurType={!isPublicPage && isSelf}
        showContentPublicity={!isPublicPage && isSelf}
        showFooter={isPublicPage && !isSelf}
      />
    ),
    [type, part, concern, isMobile, isSelf, appliedBlurType]
  );

  return (
    <Stack className={classes.container}>
      {proof && proof.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader m="auto" />
            </Stack>
          }
          loadMore={() =>
            handleFetchProof({
              followingUserId,
              currentArray: proof,
              concern,
              type,
              part,
              query,
              skip: hasMore,
            })
          }
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={columns || 1}
            columnGutter={16}
            render={memoizedStyleCard}
            items={proof}
          />
        </InfiniteScroll>
      ) : (
        <OverlayWithText icon={<IconCircleOff className="icon" />} text="Nothing found" />
      )}
    </Stack>
  );
}
