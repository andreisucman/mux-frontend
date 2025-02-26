"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import SearchButton from "@/components/SearchButton";
import { UserContext } from "@/context/UserContext";
import fetchProof, { FetchProofProps } from "@/functions/fetchProof";
import GeneralResultsHeader from "../GeneralResultsHeader";

export const runtime = "edge";

const [spotlightStore, proofSpotlight] = createSpotlight();

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

export default function AllProof() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const query = searchParams.get("query");
  const sort = searchParams.get("sort");
  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const concern = searchParams.get("concern");

  const handleFetchProof = useCallback(
    async ({
      part,
      ethnicity,
      sex,
      ageInterval,
      concern,
      currentArray,
      query,
      skip,
      sort,
    }: HandleFetchProofProps) => {
      const data = await fetchProof({
        concern,
        part,
        query,
        ethnicity,
        sex,
        ageInterval,
        currentArrayLength: currentArray?.length || 0,
        skip,
        sort,
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
    handleFetchProof({
      part,
      ageInterval,
      ethnicity,
      sex,
      concern,
      currentArray: proof,
      query,
      sort,
    });
  }, [status, part, concern, query, ageInterval, ethnicity, sex]);

  return (
    <Stack className={"mediumPage"} flex={1}>
      <GeneralResultsHeader
        filterNames={["part", "sex", "ageInterval", "ethnicity", "concern"]}
        children={
          <SearchButton
            collection="proof"
            searchPlaceholder="Search proof"
            spotlight={proofSpotlight}
            spotlightStore={spotlightStore}
            showActivityIndicator
          />
        }
      />
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          handleFetchProof={fetchProof}
          setProof={setProof}
          isPublicPage={true}
        />
      ) : (
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </Stack>
  );
}
