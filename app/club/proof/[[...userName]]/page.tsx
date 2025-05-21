"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { proofSortItems } from "@/data/sortItems";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import registerView from "@/functions/registerView";
import SelectPartOrConcern from "../../routines/[[...userName]]/SelectPartOrConcern";
import ViewsCounter from "../../ViewsCounter";
import classes from "./proof.module.css";

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
  const searchParams = useSearchParams();

  const { userDetails } = useContext(UserContext);
  const { publicUserData } = useContext(ClubContext);
  const [proof, setProof] = useState<SimpleProofType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);

  const query = searchParams.get("query");
  const part = searchParams.get("part");
  const sort = searchParams.get("sort");
  const concern = searchParams.get("concern");

  const { name } = userDetails || {};
  const isSelf = name === userName;

  const handleFetchProof = useCallback(
    async ({ part, userName, sort, concern, currentArray, query, skip }: HandleFetchProofProps) => {
      const message = await fetchUsersProof({
        concern,
        part,
        query,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      const { data } = message || {};

      if (skip) {
        setProof([...(proof || []), ...data.slice(0, 20)]);
      } else {
        setProof(data.slice(0, 20));
      }

      setHasMore(data.length === 21);
    },
    [proof]
  );

  useEffect(() => {
    if (!userName) return;
    getFilters({
      collection: "proof",
      filter: [`userName=${userName}`],
      fields: ["part", "concern"],
    }).then((result) => {
      const { part, concern } = result;
      setAvailableParts(part);
      setAvailableConcerns(concern);
    });
  }, [userName]);

  useEffect(() => {
    handleFetchProof({ userName, sort, part, concern, query });
  }, [userName, part, concern, sort, concern, query]);

  useEffect(() => {
    if (!part || !concern || !userName) return;
    registerView(part, concern, "proof", userName);
  }, [typeof part, typeof concern, typeof userName]);

  const noPartOrConcern = !part || !concern;

  const titles = clubPageTypeItems.map((item) => ({
    label: item.label,
    addQuery: true,
    value: `club/${item.value}/${userName}`,
  }));

  return (
    <ClubModerationLayout
      header={
        <PageHeader
          titles={titles}
          filterNames={["part", "concern"]}
          disableFilter={!availableConcerns && !availableParts}
          disableSort={!availableConcerns && !availableParts}
          children={<ViewsCounter userName={userName} page="proof" />}
          childrenPosition="first"
          sortItems={proofSortItems}
          defaultSortValue="-_id"
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProofFilterCardContent,
            })
          }
          nowrapContainer
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.wrapper}>
        {noPartOrConcern ? (
          <SelectPartOrConcern
            partFilterItems={availableParts}
            concernFilterItems={availableConcerns}
          />
        ) : (
          <>
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
              <Loader
                m="0 auto"
                pt="30%"
                color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
              />
            )}
          </>
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
