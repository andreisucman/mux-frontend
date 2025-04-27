import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import fetchPurchases from "@/functions/fetchPurchases";
import openErrorModal from "@/helpers/openErrorModal";
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

  const onUnsubscribeClick = useCallback(
    () =>
      openErrorModal({
        title: "Manage subscriptions",
        description: (
          <Text>
            To manage subscriptions visit the{" "}
            <Link
              href="/settings"
              style={{ textDecoration: "underline" }}
              onClick={() => modals.closeAll()}
            >
              settings.
            </Link>
          </Text>
        ),
      }),
    []
  );

  const handleOpenModal = useCallback(
    async (sellerId: string, sellerName: string, part: string, concern: string) => {
      modals.openContextModal({
        modal: "general",
        centered: true,
        classNames: { overlay: "overlay" },
        withCloseButton: true,
        title: (
          <Title order={5} component={"p"}>
            {"Subscribe to updates"}
          </Title>
        ),
        innerProps: (
          <SubscribeToUpdatesModalContent
            sellerId={sellerId}
            sellerName={sellerName}
            part={part}
            concern={concern}
          />
        ),
      });
    },
    [hasMore, purchases]
  );

  useEffect(() => {
    handleFetchPurchases(false, 0);
  }, []);

  return (
    <Skeleton className={classes.container} visible={!purchases}>
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
            onUnsubscribeClick={onUnsubscribeClick}
          />
        ) : (
          <OverlayWithText text="Nothng found" icon={<IconCircleOff className="icon" />} />
        )}
      </Stack>
    </Skeleton>
  );
}
