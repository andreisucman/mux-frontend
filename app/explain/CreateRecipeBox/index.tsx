import React, { useCallback, useContext } from "react";
import { Button, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
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
  const { userDetails } = useContext(UserContext);
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
            openErrorModal({
              description: response.error,
            });

            return;
          }

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
      classNames: { overlay: "overlay" },
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
