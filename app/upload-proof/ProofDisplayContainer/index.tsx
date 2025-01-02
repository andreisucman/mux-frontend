import React, { useCallback, useMemo, useState } from "react";
import NextImage from "next/image";
import { Image, rem, Stack, Text } from "@mantine/core";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import { ExistingProofRecordType } from "../types";
import classes from "./ProofDisplayContainer.module.css";

type Props = {
  existingProofRecord: ExistingProofRecordType;
  setExistingProofRecord: React.Dispatch<React.SetStateAction<ExistingProofRecordType | null>>;
};

export default function ProofDisplayContainer({
  existingProofRecord,
  setExistingProofRecord,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { contentType, createdAt, hash, _id, mainUrl, isPublic, mainThumbnail } =
    existingProofRecord;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  const handleUpdateExistingRecord = useCallback((input: { [key: string]: any }) => {
    setExistingProofRecord((prev: any) => ({
      ...(prev || {}),
      mainUrl: input.mainUrl,
      mainThumbnail: input.mainThumbnail,
    }));
  }, []);

  return (
    <Stack className={classes.container}>
      {createdAt && <Text className={classes.date}>{formattedDate}</Text>}{" "}
      <ContentBlurTypeButton
        contentId={_id}
        isDisabled={isLoading}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        hash={hash}
        contentCategory={"proof"}
        currentMain={mainUrl}
        position="top-right"
        customStyles={{ top: rem(16), right: rem(16) }}
        onComplete={handleUpdateExistingRecord}
      />
      {contentType === "image" ? (
        <Image
          src={mainUrl.url}
          component={NextImage}
          className={classes.item}
          width={300}
          height={300}
          alt=""
        />
      ) : (
        <VideoPlayer
          url={mainUrl.url}
          thumbnail={mainThumbnail.url}
          createdAt={createdAt}
          isRelative
        />
      )}
      <ContentPublicityIndicator isPublic={isPublic} position="bottom-right" />
    </Stack>
  );
}
