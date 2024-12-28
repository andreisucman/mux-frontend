import React, { useCallback, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconBolt, IconPlus, IconSquareRoundedCheck } from "@tabler/icons-react";
import { Button, Group, rem, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { RecipeType, UserDataType } from "@/types/global";
import RecipeSettingsContent from "./RecipeSettingsContent";
import classes from "./CreateRecipeBox.module.css";

type Props = {
  taskId: string | null;
  recipe?: RecipeType;
  userDetails?: UserDataType;
  setShowWaitComponent: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateRecipeBox({ taskId, recipe, setShowWaitComponent }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};
  const { canPersonalize } = recipe || {};

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
              const { subscriptions, demographics } = userDetails || {};
              const { improvement } = subscriptions || {};
              const { isTrialUsed } = improvement || {};
              const { sex } = demographics || {};

              const coachIcon = sex === "male" ? "🦸‍♂️" : "🦸‍♀️";
              const buttonText = !!isTrialUsed ? "Add" : "Try free for 1 day";
              const buttonIcon = !!isTrialUsed ? (
                <IconPlus className="icon" style={{ marginRight: rem(6) }} />
              ) : (
                <IconSquareRoundedCheck className="icon" />
              );

              const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;
              const onClick = !!isTrialUsed
                ? async () =>
                    createCheckoutSession({
                      priceId: process.env.NEXT_PUBLIC_IMPROVEMENT_PRICE_ID!,
                      redirectUrl,
                      cancelUrl: redirectUrl,
                      setUserDetails,
                    })
                : () =>
                    startSubscriptionTrial({
                      subscriptionName: "improvement",
                    });

              openSubscriptionModal({
                title: `${coachIcon} Add the Improvement Coach`,
                price: "3",
                isCentered: true,
                modalType: "improvement",
                underButtonText: "No credit card required",
                onClick,
                buttonText,
                buttonIcon,
                onClose: () => fetchUserData(setUserDetails),
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
      size: "auto",
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
      {recipe ? (
        <Text size="xl">
          <IconBolt className="icon icon__large" /> About {recipe.calories} cal.
        </Text>
      ) : (
        <Button className={classes.button} disabled={!canPersonalize} onClick={openEditTaskModal}>
          <IconPlus className="icon" style={{ marginRight: rem(6) }} /> Create recipe
        </Button>
      )}
    </Group>
  );
}
