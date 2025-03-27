import React, { useCallback } from "react";
import { IconBlur } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import callTheServer from "@/functions/callTheServer";
import { ProgressImageType } from "@/types/global";
import BlurEditor from "./BlurEditor";
import { HandleSaveBlurProps, HandleSelectProps, HandleUpdateRecordType } from "./types";
import classes from "./ContentBlurButton.module.css";

type Props = {
  isDisabled: boolean;
  isRelative?: boolean;
  contentId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  images: ProgressImageType[];
  setRecords?: React.Dispatch<React.SetStateAction<any | undefined>>;
  onComplete?: (props: { [key: string]: any }) => void;
};

export default function ContentBlurButton({
  contentId,
  images,
  isDisabled,
  isRelative,
  setRecords,
  setIsLoading,
  onComplete,
}: Props) {
  const handleUpdateRecord = useCallback(({ contentId, updateObject }: HandleUpdateRecordType) => {
    try {
      if (setRecords)
        setRecords((prev: any) =>
          prev?.map((rec: any) => (rec._id === contentId ? { ...rec, ...updateObject } : rec))
        );
      if (onComplete) onComplete(updateObject);
    } catch (err) {
      console.log("Error in handleUpdateRecord: ", err);
    }
  }, []);

  const handleSelectBlurType = useCallback(async ({ blurType, contentId }: HandleSelectProps) => {
    setIsLoading(true);

    const response = await callTheServer({
      endpoint: "updateContentBlurType",
      method: "POST",
      body: { blurType, contentId },
    });

    if (response.status === 200) {
      const { mainUrl, images } = response.message;

      if (mainUrl || images) {
        handleUpdateRecord({
          contentId,
          updateObject: response.message,
        });
        setIsLoading(false);
      }
    }
  }, []);

  const handleSaveBlur = useCallback(
    async ({ blurDots, offsets, image }: HandleSaveBlurProps) => {
      const updatedBlurDots = blurDots.map((obj) => {
        return {
          ...obj,
          originalHeight:
            offsets.scaleHeight > 1
              ? obj.originalHeight / offsets.scaleHeight
              : obj.originalHeight * offsets.scaleHeight,
          originalWidth:
            offsets.scaleWidth > 1
              ? obj.originalWidth / offsets.scaleWidth
              : obj.originalWidth * offsets.scaleWidth,
          x: offsets.scaleWidth > 1 ? obj.x / offsets.scaleWidth : obj.x * offsets.scaleWidth,
          y: offsets.scaleHeight > 1 ? obj.y / offsets.scaleHeight : obj.y * offsets.scaleHeight,
        };
      });

      const response = await callTheServer({
        endpoint: "createNewBlur",
        method: "POST",
        body: { contentId, blurDots: updatedBlurDots, image },
      });

      if (response.status === 200) {
        if (setRecords) {
          setRecords((prev: any) =>
            prev?.map((rec: any) => (rec._id === contentId ? { ...rec, ...response.message } : rec))
          );
        }
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
      innerProps: (
        <BlurEditor
          images={images}
          onUpdate={handleSaveBlur}
          handleSelectBlurType={handleSelectBlurType}
          contentId={contentId}
        />
      ),
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
