import React, { useCallback, useContext, useEffect, useState } from "react";
import { Stack, Text } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import fetchPurchases from "@/functions/fetchPurchases";
import { PurchaseType } from "@/types/global";
import BalancePane from "../BalancePane";
import ClubProfilePreview from "../ClubProfilePreview";
import PurchasesList from "../PurchasesList";
import classes from "./ClubSellerContent.module.css";

export default function ClubSellerContent() {
  const [hasMore, setHasMore] = useState(false);
  const [buyers, setBuyers] = useState<PurchaseType[]>();
  const { userDetails } = useContext(UserContext);
  const { name, avatar, club, latestScoresDifference } = userDetails || {};
  const { intro, socials } = club || { socials: [] };

  const handleFetchPurchases = useCallback(
    async (skip: boolean, existingCount?: number) => {
      const items = await fetchPurchases({ skip, existingCount, type: "seller" });

      if (skip) {
        setBuyers((prev) => [...(prev || []), ...items.slice(0, 20)]);
      } else {
        setBuyers(items.slice(0, 20));
      }
      setHasMore(items.length === 21);
    },
    [buyers]
  );

  useEffect(() => {
    handleFetchPurchases(false, 0);
  }, []);

  return (
    <Stack className={classes.container}>
      <ClubProfilePreview
        data={{ name, avatar, intro, socials, latestScoresDifference }}
        type="you"
        showButton
      />
      <BalancePane />
      <Stack className={classes.list}>
        <Text c="dimmed" size="sm">
          Your buyers
        </Text>
        <PurchasesList
          pageType="seller"
          hasMore={hasMore}
          data={buyers}
          handleFetchPurchases={() => handleFetchPurchases(hasMore, buyers?.length)}
        />
      </Stack>
    </Stack>
  );
}
