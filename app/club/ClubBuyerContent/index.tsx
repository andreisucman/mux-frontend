import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import fetchPurchases from "@/functions/fetchPurchases";
import { useRouter } from "@/helpers/custom-router";
import { PurchaseType } from "@/types/global";
import PurchasesList from "../PurchasesList";
import SubscribeToUpdatesModalContent from "./SubscribeToUpdatesModalContent";
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

  const handleOpenModal = useCallback(
    async (sellerId: string, part: string) => {
      modals.openContextModal({
        modal: "general",
        centered: true,
        withCloseButton: true,
        title: (
          <Title order={5} component={"p"}>
            {"Subscribe to updates"}
          </Title>
        ),
        innerProps: <SubscribeToUpdatesModalContent sellerId={sellerId} part={part} />,
      });
    },
    [hasMore, purchases]
  );

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
            pageType="buyer"
            hasMore={hasMore}
            data={purchases}
            handleFetchPurchases={() =>
              handleFetchPurchases(hasMore, purchases && purchases.length)
            }
            onRowClick={onRowClick}
            onSubscribeClick={handleOpenModal}
          />
        ) : (
          <OverlayWithText text="Nothng found" icon={<IconCircleOff className="icon" />} />
        )}
      </Stack>
    </Stack>
  );
}
