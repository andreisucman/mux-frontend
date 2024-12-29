"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "@mantine/core";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import { UserContext } from "@/context/UserContext";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import openErrorModal from "@/helpers/openErrorModal";
import ClubModerationLayout from "../../ModerationLayout";

export const runtime = "edge";

interface HandleFetchProofProps extends FetchProofProps {
  currentArray?: SimpleProofType[];
}

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubProof(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];
  
  const { status, userDetails } = useContext(UserContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  const { name } = userDetails || {};
  const isSelf = name === userName;

  const handleFetchProof = useCallback(
    async ({ type, part, userName, concern, currentArray, query, skip }: HandleFetchProofProps) => {
      const data = await fetchUsersProof({
        concern,
        part,
        query,
        type,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
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

    handleFetchProof({ userName, type, part, concern, query });
  }, [status, userName, type, part, concern, query]);

  return (
    <ClubModerationLayout userName={userName} pageType="proof">
      {proof ? (
        <ProofGallery
          proof={proof}
          hasMore={hasMore}
          userName={userName}
          handleFetchProof={handleFetchProof}
          setProof={setProof}
          isSelf={isSelf}
          isPublicPage
          columns={2}
        />
      ) : (
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </ClubModerationLayout>
  );
}
