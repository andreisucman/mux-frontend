import React, { useState } from "react";
import cn from "classnames";
import { Group } from "@mantine/core";
import { SimpleProgressType } from "@/app/results/types";
import { ProgressImageType, ProgressType } from "@/types/global";
import ContentBlurButton from "../ContentBlurButton";
import DeleteContentButton from "../DeleteContentButton";
import classes from "./ContentModerationButtons.module.css";

type Props = {
  showBlur?: boolean;
  showDelete?: boolean;
  isRelative?: boolean;
  contentId: string;
  images: ProgressImageType[];
  collectionKey: "progress" | "proof" | "diary" | "about";
  setContent?: React.Dispatch<React.SetStateAction<SimpleProgressType[] | undefined>>;
};

export default function ContentModerationButtons({
  contentId,
  showDelete,
  showBlur,
  isRelative,
  images,
  collectionKey,
  setContent,
}: Props) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  return (
    <Group className={cn(classes.container, { [classes.relative]: isRelative })}>
      {showDelete && (
        <DeleteContentButton
          contentId={contentId}
          collectionKey={collectionKey}
          setContent={setContent}
          isLoading={isDeleteLoading}
          setIsLoading={setIsDeleteLoading}
          isDisabled={isDeleteLoading}
          isRelative
        />
      )}
      {showBlur && (
        <ContentBlurButton
          contentId={contentId}
          images={images}
          setRecords={setContent}
          isDisabled={isDeleteLoading}
          isRelative
        />
      )}
    </Group>
  );
}
