import React, { useCallback, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { useRouter } from "@/helpers/custom-router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import openPaymentModal from "@/helpers/openPaymentModal";
import { RecipeType, UserDataType } from "@/types/global";
import RecipeSettingsContent from "./RecipeSettingsContent";
import classes from "./CreateRecipeBox.module.css";

type Props = {
  taskId: string | null;
  recipe?: RecipeType;
  isDisabled?: boolean;
  userDetails?: UserDataType;
  setShowWaitComponent: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateRecipeBox({
  taskId,
  recipe,
  isDisabled,
  setShowWaitComponent,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};
  const { canPersonalize } = recipe || {};

  const canCreateRecipe = !recipe || !!canPersonalize;

  const generateRecipe = useCallback(
    async (constraints?: string, productsImage?: string) => {
      if (!taskId) return;

      try {
        const response = await callTheServer({
          endpoint: "createRecipe",
          body: { taskId, constraints, productsImage },
          method: "POST",
        });

        if (response.status === 200) {
          if (response.error) {
            if (response.error === "subscription expired") {
              const { subscriptions } = userDetails || {};
              const { improvement } = subscriptions || {};
              const { isTrialUsed } = improvement || {};

              const buttonText = !!isTrialUsed ? "Add coach" : "Try free for 1 week";

              const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;
              const onClick = !!isTrialUsed
                ? async () =>
                    createCheckoutSession({
                      type: "platform",
                      body: {
                        priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
                        redirectUrl,
                        cancelUrl: redirectUrl,
                        mode: "subscription"
                      },
                      setUserDetails,
                    })
                : () =>
                    startSubscriptionTrial({
                      subscriptionName: "improvement",
                      router,
                    });

              openPaymentModal({
                title: "Add the improvement coach",
                price: (
                  <Group className="priceGroup">
                    <Title order={4}>$5</Title>/ <Text>month</Text>
                  </Group>
                ),
                isCentered: true,
                modalType: "improvement",
                underButtonText: isTrialUsed ? "" : "No credit card required",
                onClick,
                buttonText,
                onClose: () => fetchUserData({ setUserDetails }),
              });
              return;
            } else {
              openErrorModal({
                description: response.error,
                onClose: () => modals.closeAll(),
              });
            }
          }

          saveToLocalStorage("runningAnalyses", { [`createRecipe-${taskId}`]: true }, "add");

          setShowWaitComponent(true);
          modals.closeAll();
        }
      } catch (err) {}
    },
    [taskId, userId]
  );

  const openEditTaskModal = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      size: "md",
      title: (
        <Title order={5} component={"p"}>
          Recipe settings
        </Title>
      ),
      innerProps: <RecipeSettingsContent onSubmit={generateRecipe} />,
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Button
        className={classes.button}
        disabled={!canCreateRecipe || isDisabled}
        onClick={openEditTaskModal}
      >
        Create another recipe
      </Button>
    </Group>
  );
}
