"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import ProofGallery from "@/app/results/proof/ProofGallery";
import { SimpleProofType } from "@/app/results/proof/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import PageHeaderClub from "@/components/PageHeaderClub";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { proofSortItems } from "@/data/sortItems";
import { FetchProofProps } from "@/functions/fetchProof";
import fetchUsersProof from "@/functions/fetchUsersProof";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
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
    getFilters({
      collection: "proof",
      fields: ["part", "concern"],
    }).then((result) => {
      const { part, concern } = result;
      setAvailableParts(part);
      setAvailableConcerns(concern);
    });
  }, []);

  useEffect(() => {
    handleFetchProof({ userName, sort, part, concern, query });
  }, [userName, part, concern, sort, concern, query]);

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  const titles = clubPageTypeItems.map((item) => ({
    label: item.label,
    addQuery: true,
    value: `club/${item.value}/${userName}`,
  }));

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="proof"
          titles={titles}
          userName={userName}
          filterNames={["part"]}
          disableFilter={!availableConcerns && !availableParts}
          disableSort={noPartsAndConcerns}
          sortItems={proofSortItems}
          defaultSortValue="-_id"
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProofFilterCardContent,
            })
          }
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.wrapper}>
        <Stack className={cn(classes.content, "scrollbar")}>
          {proof ? (
            <>
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
            </>
          ) : (
            <Loader
              m="0 auto"
              pt="30%"
              color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
            />
          )}
        </Stack>
      </Stack>
    </ClubModerationLayout>
  );
}
