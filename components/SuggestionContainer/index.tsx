import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconCirclePlus, IconListSearch, IconSquareRoundedCheck } from "@tabler/icons-react";
import { Group, rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { getFromLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { SuggestionType } from "@/types/global";
import FindProductsOverlay from "../FindProductsOverlay";
import WaitComponent from "../WaitComponent";
import ProductCell from "./ProductCell";
import ProductsCriteriaContainer from "./ProductsCriteriaContainer";
import classes from "./SuggestionContainer.module.css";

type Props = {
  taskKey?: string;
  title?: string;
  footer?: string;
  showOnCellAtc?: boolean;
  selectedAsins?: string[];
  items: SuggestionType[];
  productsPersonalized?: boolean;
  rowStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
  refetchTask?: (args?: any) => void;
  setSelectedAsins?: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function SuggestionContainer({
  title,
  items,
  footer,
  taskKey,
  rowStyles,
  showOnCellAtc,
  selectedAsins,
  customStyles,
  productsPersonalized,
  refetchTask,
  setSelectedAsins,
}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [showWaitComponent, setShowWaitComponent] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const type = searchParams.get("type");

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

  const handleCreateCheckoutSession = useCallback(async () => {
    createCheckoutSession({
      priceId: process.env.NEXT_PUBLIC_ANALYST_PRICE_ID!,
      redirectUrl,
      cancelUrl: redirectUrl,
      setUserDetails,
      cb: () => {
        const criteria: string | null = getFromLocalStorage("productCriteria");
        if (criteria && taskKey) findProducts(taskKey, criteria);
      },
    });
  }, []);

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
            const { analyst } = subscriptions || {};
            const { isTrialUsed } = analyst || {};

            const buttonText = !!isTrialUsed ? "Add" : "Try free for 1 day";

            const onClick = !!isTrialUsed
              ? handleCreateCheckoutSession
              : () =>
                  startSubscriptionTrial({
                    subscriptionName: "analyst",
                    onComplete: () => findProducts(taskKey, criteria),
                  });

            openSubscriptionModal({
              title: "Add the analyst coach",
              modalType: "analyst",
              isCentered: true,
              price: "4",
              buttonText,
              underButtonText: "No credit card required",
              onClose: handleRefetchData,
              onClick,
            });
            return;
          }
          setShowWaitComponent(true);
        } else {
          setShowWaitComponent(false);
          openErrorModal({
            description: response.error,
          });
        }
      } catch (err) {
        openErrorModal();
      }
    },
    [userDetails?._id]
  );

  const openProductsCriteriaContainer = useCallback((taskKey?: string) => {
    if (!taskKey) return;

    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          Tell your criteria
        </Title>
      ),
      innerProps: <ProductsCriteriaContainer taskKey={taskKey} findProducts={findProducts} />,
    });
  }, []);

  const waitComponentStyles = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      justifyContent: "center",
      zIndex: 1,
      backgroundColor: "rgba(0,0,0,0.25)",
      borderRadius: " 1rem",
    }),
    []
  );

  const showPersonalize = !showOverlay && !productsPersonalized;

  useEffect(() => {
    if (productsPersonalized === undefined) return;
    setShowOverlay(!productsPersonalized);
  }, [productsPersonalized, type, taskKey]);

  const bestItems = items.filter((item) => item.rank === 1);
  const chosenItems = bestItems.length > 1 ? bestItems : items;

  useEffect(() => {
    // to start the analysis and change the default overlay to progress
    if (!taskKey) return;
    const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");

    if (runningAnalyses) {
      const currentStatus = runningAnalyses[taskKey];

      if (currentStatus) {
        setShowWaitComponent(true);
      }
    }
  }, [taskKey]);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      {taskKey && (
        <>
          {showWaitComponent && (
            <WaitComponent
              operationKey={taskKey}
              description="Comparing products"
              onComplete={() => {
                if (refetchTask) refetchTask();
                setShowWaitComponent(false);
              }}
              customContainerStyles={waitComponentStyles}
              hideDisclaimer
            />
          )}
          {showOverlay && !showWaitComponent && (
            <FindProductsOverlay
              onClick={() => openProductsCriteriaContainer(taskKey)}
              setShowOverlay={setShowOverlay}
              customStyles={customStyles}
            />
          )}
        </>
      )}
      <Skeleton className="skeleton" visible={!items}>
        {title && (
          <Group className={classes.titleGroup}>
            <Text c="dimmed" className={classes.title}>
              {title}
            </Text>
            {taskKey && (
              <>
                {showPersonalize && (
                  <Text
                    className={classes.title}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowOverlay(true)}
                  >
                    <IconListSearch className="icon" style={{ marginRight: rem(6) }} /> Compare and
                    sort best
                  </Text>
                )}
                {productsPersonalized && (
                  <Text className={classes.title}>
                    <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(6) }} /> Best
                    sorted
                  </Text>
                )}
              </>
            )}
          </Group>
        )}
        <Group className={classes.wrapper}>
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
        {footer && <Text className={classes.footer}>{footer}</Text>}
      </Skeleton>
    </Stack>
  );
}
