"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import fetchProof, { FetchProofProps } from "@/functions/fetchProof";
import openErrorModal from "@/helpers/openErrorModal";
import ProofGallery from "../results/proof/ProofGallery";
import ProofHeader from "../results/proof/ProofHeader";
import { SimpleProofType } from "../results/proof/types";
import classes from "./proof.module.css";

export const runtime = "edge";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

export default function AllProof() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const concern = searchParams.get("concern");

  const handleFetchProof = useCallback(
    async ({
      type,
      part,
      ethnicity,
      sex,
      ageInterval,
      concern,
      currentArray,
      query,
      skip,
    }: HandleFetchProofProps) => {
      const data = await fetchProof({
        concern,
        part,
        query,
        type,
        ethnicity,
        sex,
        ageInterval,
        currentArrayLength: currentArray?.length || 0,
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

    handleFetchProof({
      type,
      part,
      ageInterval,
      ethnicity,
      sex,
      concern,
      currentArray: proof,
      query,
    });
  }, [status, type, part, concern, query, ageInterval, ethnicity, sex]);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <ProofHeader title="Proof" showReturn />
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          handleFetchProof={fetchProof}
          setProof={setProof}
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
