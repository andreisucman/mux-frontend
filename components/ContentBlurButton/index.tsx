import React, { useCallback } from "react";
import { IconBlur } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { SimpleProgressType } from "@/app/results/types";
import callTheServer from "@/functions/callTheServer";
import { ProgressImageType, ProgressType } from "@/types/global";
import BlurEditor from "./BlurEditor";
import { OnUpdateBlurProps } from "./types";
import classes from "./ContentBlurButton.module.css";

type Props = {
  isDisabled: boolean;
  isRelative?: boolean;
  contentId: string;
  images: ProgressImageType[];
  setRecords?: React.Dispatch<React.SetStateAction<SimpleProgressType[] | undefined>>;
};

export default function ContentBlurButton({
  contentId,
  images,
  isDisabled,
  isRelative,
  setRecords,
}: Props) {
  const onUpdateBlur = useCallback(
    async ({ blurDots, offsets, url, position }: OnUpdateBlurProps) => {
      const updatedBlurDots = blurDots.map((obj) => {
        return {
          ...obj,
          originalHeight: obj.originalHeight / offsets.scaleHeight,
          originalWidth: obj.originalWidth / offsets.scaleWidth,
          x: obj.x / offsets.scaleWidth,
          y: obj.y / offsets.scaleHeight,
        };
      });

      const response = await callTheServer({
        endpoint: "updateContentBlurType",
        method: "POST",
        body: { contentId, blurDots: updatedBlurDots, url, position },
      });

      if (response.status === 200) {
        if (setRecords) {
          setRecords((prev: SimpleProgressType[] | undefined) => {
            const newData = (prev || [])?.map((rec) =>
              rec?._id === contentId ? { ...rec, ...response.message } : rec
            );
            return newData;
          });
        }

        return response.message;
      }
    },
    [contentId]
  );

  const openNewBlur = () => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"div"}>
          New blur
        </Title>
      ),
      innerProps: <BlurEditor images={images} contentId={contentId} onUpdate={onUpdateBlur} />,
    });
  };

  return (
    <ActionIcon
      onClick={openNewBlur}
      disabled={isDisabled}
      variant="default"
      className={cn(classes.container, { [classes.relative]: !!isRelative })}
    >
      <IconBlur className="icon icon__small" />
    </ActionIcon>
  );
}
