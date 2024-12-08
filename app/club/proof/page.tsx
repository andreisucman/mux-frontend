"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@mantine/core";
import ProofGallery from "@/app/results/proof/ProofGallery";
import ProofHeader from "@/app/results/proof/ProofHeader";
import { SimpleProofType } from "@/app/results/proof/types";
import { UserContext } from "@/context/UserContext";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import openErrorModal from "@/helpers/openErrorModal";
import { clubResultTitles } from "../clubResultTitles";
import ClubModerationLayout from "../ModerationLayout";

export const runtime = "edge";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

export default function ClubProof() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const followingUserId = searchParams.get("followingUserId");

  const handleFetchProof = useCallback(
    async ({
      type,
      part,
      followingUserId,
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
        currentArrayLength: (currentArray && currentArray.length) || 0,
        followingUserId,
        skip,
      });

      if (data) {
        if (skip) {
          setProof([...(proof || []), ...data.slice(0, 20)]);
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

    handleFetchProof({ followingUserId, type, part, concern, query });
  }, [status, followingUserId, type, part, concern, query]);

  return (
    <ClubModerationLayout pageHeader={<ProofHeader showReturn titles={clubResultTitles} />}>
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          handleFetchProof={handleFetchProof}
          setProof={setProof}
        />
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </ClubModerationLayout>
  );
}
