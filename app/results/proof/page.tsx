"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack, Skeleton } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { UserContext } from "@/context/UserContext";
import fetchProof, { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import openErrorModal from "@/helpers/openErrorModal";
import { individualResultTitles } from "../individualResultTitles";
import ProofGallery from "./ProofGallery";
import ProofHeader from "./ProofHeader";
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

  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  const handleFetchProof = useCallback(
    async ({
      followingUserId,
      type,
      part,
      concern,
      currentArray,
      query,
      skip,
    }: HandleFetchProofProps) => {
      const data = await fetchUsersProof({
        concern,
        part,
        query,
        type,
        currentArrayLength: currentArray?.length || 0,
        followingUserId,
        skip,
      });

      if (data) {
        if (skip) {
          setProof([...(currentArray || []), ...data.slice(0, 20)]);
        } else {
          setProof(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      } else {
        openErrorModal();
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProof({ type, part, concern, query });
  }, [status, type, part, concern, query]);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <SkeletonWrapper>
        <ProofHeader titles={individualResultTitles} showReturn />
        {proof ? (
          <ProofGallery
            proof={proof}
            hasMore={hasMore}
            handleFetchProof={fetchProof}
            setProof={setProof}
            isSelfPage
          />
        ) : (
          // <Loader m="auto" />
          <Skeleton className="skeleton" flex={1}></Skeleton>
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
