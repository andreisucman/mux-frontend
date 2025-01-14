import React, { useCallback, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import ChatWithOverlay from "@/app/club/ModerationLayout/ChatWithOverlay";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import openErrorModal from "@/helpers/openErrorModal";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { SuggestionType } from "@/types/global";
import ProductCell from "./ProductCell";
import classes from "./SuggestionContainer.module.css";

type Props = {
  chatContentId: string;
  title?: string;
  showOnCellAtc?: boolean;
  selectedAsins?: string[];
  items: SuggestionType[];
  disableLocalChat?: boolean;
  rowStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
  setSelectedAsins?: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function SuggestionContainer({
  title,
  items,
  chatContentId,
  rowStyles,
  disableLocalChat,
  showOnCellAtc,
  selectedAsins,
  customStyles,
  setSelectedAsins,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

  const handleRefetchData = useCallback(async () => {
    const userData = await fetchUserData();
    if (userData) setUserDetails(userData);
  }, []);

  const findProducts = useCallback(
    async (taskKey: string, criteria: string) => {
      if (!taskKey) return;
      if (!criteria) return;

      try {
        const response = await callTheServer({
          endpoint: "findProducts",
          method: "POST",
          body: { taskKey, criteria },
        });

        if (response.status === 200) {
          if (response.error === "subscription expired") {
            const { subscriptions } = userDetails || {};
            const { advisor } = subscriptions || {};
            const { isTrialUsed } = advisor || {};

            const buttonText = !!isTrialUsed ? "Add coach" : "Try free for 1 day";

            const onClick = !!isTrialUsed
              ? () =>
                  createCheckoutSession({
                    priceId: process.env.NEXT_PUBLIC_ANALYST_PRICE_ID!,
                    redirectUrl,
                    cancelUrl: redirectUrl,
                    setUserDetails,
                  })
              : () =>
                  startSubscriptionTrial({
                    subscriptionName: "advisor",
                    onComplete: () => findProducts(taskKey, criteria),
                  });

            openSubscriptionModal({
              title: "Add the advisor coach",
              modalType: "advisor",
              isCentered: true,
              price: "9",
              buttonText,
              underButtonText: "No credit card required",
              onClose: handleRefetchData,
              onClick,
            });
            return;
          }
        } else {
          openErrorModal({
            description: response.error,
          });
        }
      } catch (err) {}
    },
    [userDetails]
  );

  const bestItems = items.filter((item) => item.rank === 1);
  const chosenItems = bestItems.length > 1 ? bestItems : items;

  return (
    <Skeleton className="skeleton" visible={!items}>
      <Stack className={classes.container} style={customStyles ? customStyles : {}}>
        <Stack className={classes.wrapper}>
          {title && (
            <Text c="dimmed" className={classes.title}>
              {title}
            </Text>
          )}
          <Group className={classes.content}>
            <Group className={classes.suggestionRow} style={rowStyles ? rowStyles : {}}>
              {chosenItems?.map((item, index) => (
                <ProductCell
                  key={index}
                  item={item}
                  allItems={items}
                  showOnCellAtc={showOnCellAtc || false}
                  selectedAsins={selectedAsins}
                  setSelectedAsins={setSelectedAsins}
                />
              ))}
            </Group>
          </Group>
        </Stack>

        {!disableLocalChat && (
          <ChatWithOverlay
            chatCategory="product"
            chatContentId={chatContentId}
            dividerLabel={"Choose best for me"}
            defaultVisibility="open"
          />
        )}
      </Stack>
    </Skeleton>
  );
}
