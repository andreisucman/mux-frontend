import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Stack, Text } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import fetchPurchases from "@/functions/fetchPurchases";
import { useRouter } from "@/helpers/custom-router";
import { PurchaseType } from "@/types/global";
import PurchasesList from "../PurchasesList";
import classes from "./ClubBuyerContent.module.css";

export default function ClubBuyerContent() {
  const router = useRouter();
  const [hasMore, setHasMore] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseType[]>();

  const handleFetchPurchases = useCallback(
    async (skip: boolean, existingCount?: number) => {
      const items = await fetchPurchases({ skip, existingCount, type: "buyer" });

      if (skip) {
        setPurchases((prev) => [...(prev || []), ...items.slice(0, 20)]);
      } else {
        setPurchases(items.slice(0, 20));
      }
      setHasMore(items.length === 21);
    },
    [purchases]
  );

  const onRowClick = (userName: string) => {
    router.push(`/club/routines/${userName}`);
  };

  useEffect(() => {
    handleFetchPurchases(false, 0);
  }, []);

  return (
    <Stack className={classes.container}>
      <Text c="dimmed" size="sm">
        Your purchases
      </Text>
      <Stack className={classes.list}>
        {purchases ? (
          <PurchasesList
            hasMore={hasMore}
            data={purchases}
            handleFetchPurchases={() =>
              handleFetchPurchases(hasMore, purchases && purchases.length)
            }
            onRowClick={onRowClick}
          />
        ) : (
          <OverlayWithText text="Nothng found" icon={<IconCircleOff className="icon" />} />
        )}
      </Stack>
    </Stack>
  );
}
