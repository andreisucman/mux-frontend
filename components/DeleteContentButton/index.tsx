import React, { useCallback } from "react";
import { IconTrash } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import askConfirmation from "@/helpers/askConfirmation";
import classes from "./DeleteContentButton.module.css";

type Props = {
  contentId: string;
  collectionKey: "progress" | "proof" | "diary" | "about";
  position?: "top-right" | "top-left";
  isRelative?: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setContent?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function DeleteContentButton({
  collectionKey,
  position = "top-right",
  isRelative,
  isLoading,
  isDisabled,
  contentId,
  setContent,
  setIsLoading,
}: Props) {
  const deleteContent = useCallback(async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      if (contentId !== "temp") {
        await callTheServer({
          endpoint: "deleteContent",
          method: "POST",
          body: { contentId, collectionKey },
        });
      }

      if (setContent) setContent((prev) => (prev || []).filter((i) => i._id !== contentId));
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [collectionKey, contentId]);

  const handleDelete = useCallback(() => {
    askConfirmation({
      title: "Confirm deletion",
      body: "This action is irreversible. Continue?",
      onConfirm: deleteContent,
    });
  }, [deleteContent]);

  return (
    <ActionIcon
      disabled={isDisabled}
      loading={isLoading}
      variant="default"
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
      className={cn(classes.container, {
        [classes.relative]: isRelative,
        [classes[position]]: true,
      })}
    >
      <IconTrash className={"icon icon__small"} color={"var(--mantine-color-gray-2)"} />
    </ActionIcon>
  );
}
