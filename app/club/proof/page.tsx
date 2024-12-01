"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "@mantine/core";
import ProofGallery from "@/app/results/proof/ProofGallery";
import ProofHeader from "@/app/results/proof/ProofHeader";
import { SimpleProofType } from "@/app/results/proof/types";
import { UserContext } from "@/context/UserContext";
import fetchUsersProof, { FetchUsersProofProps } from "@/functions/fetchUsersProof";
import openErrorModal from "@/helpers/openErrorModal";
import ClubModerationLayout from "../ModerationLayout";

export const runtime = "edge";

export default function ClubProof() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const trackedUserId = searchParams.get("trackedUserId");

  const handleFetchProof = useCallback(
    async ({ type, part, concern, currentArrayLength, query, skip }: FetchUsersProofProps) => {
      const data = await fetchUsersProof({
        concern,
        part,
        query,
        type,
        currentArrayLength,
        trackedUserId,
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
    [trackedUserId, type, part, concern, query]
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProof({ type, part, concern, query });
  }, [status, trackedUserId, type, part, concern, query]);

  return (
    <ClubModerationLayout>
      <ProofHeader title="Proof" showReturn />
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          handleFetchProof={() => handleFetchProof({ concern, type, part, query, skip: hasMore })}
          setProof={setProof}
        />
      ) : (
        <Loader m="auto" />
      )}
    </ClubModerationLayout>
  );
}
