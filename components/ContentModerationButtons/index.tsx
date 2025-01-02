import React, { useState } from "react";
import { Group } from "@mantine/core";
import { BlurredUrlType } from "@/types/global";
import ContentBlurTypeButton from "../ContentBlurTypeButton";
import DeleteContentButton from "../DeleteContentButton";
import classes from "./ContentModerationButtons.module.css";

type Props = {
  showBlur?: boolean;
  showDelete?: boolean;
  contentId: string;
  currentMain?: BlurredUrlType;
  collectionKey: "progress" | "style" | "proof" | "diary" | "about";
  setContent?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function ContentModerationButtons({
  contentId,
  showDelete,
  showBlur,
  currentMain,
  collectionKey,
  setContent,
}: Props) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBlurLoading, setIsBlurLoading] = useState(false);

  const disabled = isDeleteLoading || isBlurLoading;

  return (
    <Group className={classes.actionButtons}>
      {showDelete && (
        <DeleteContentButton
          contentId={contentId}
          collectionKey={collectionKey}
          setContent={setContent}
          isLoading={isDeleteLoading}
          setIsLoading={setIsDeleteLoading}
          isDisabled={disabled}
          isRelative
        />
      )}
      {showBlur && currentMain && (
        <ContentBlurTypeButton
          contentId={contentId}
          currentMain={currentMain}
          contentCategory={"style"}
          setRecords={setContent}
          isLoading={isBlurLoading}
          setIsLoading={setIsDeleteLoading}
          isDisabled={disabled}
          isRelative
        />
      )}
    </Group>
  );
}
