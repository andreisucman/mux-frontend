"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import fetchProof, { FetchProofProps } from "@/functions/fetchProof";
import openErrorModal from "@/helpers/openErrorModal";
import ProofGallery from "./ProofGallery";
import StyleHeader from "./ProofHeader";
import { SimpleProofType } from "./types";
import classes from "./proof.module.css";

export const runtime = "edge";

export default function ResultsProof() {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const { _id: userId } = userDetails || {};
  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const concern = searchParams.get("concern");

  const handleFetchProof = useCallback(
    async ({ userId, type, part, concern, currentArrayLength, query, skip }: FetchProofProps) => {
      const data = await fetchProof({
        concern,
        part,
        query,
        type,
        currentArrayLength,
        userId,
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
    [userId, type, part, concern, query, ageInterval]
  );

  useEffect(() => {
    if (!userId) return;

    handleFetchProof({ type, part, concern, query });
  }, [userId, type, part, concern, query, ageInterval, ethnicity, sex]);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <StyleHeader title="Proof" showReturn />
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          handleFetchProof={() => fetchProof({ concern, type, part, query, skip: hasMore })}
          setProof={setProof}
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
