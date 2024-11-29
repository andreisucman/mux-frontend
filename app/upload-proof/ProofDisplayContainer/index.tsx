import React, { useMemo } from "react";
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
  setExistingProofRecord: React.Dispatch<
    React.SetStateAction<ExistingProofRecordType[] | undefined>
  >;
};

export default function ProofDisplayContainer({
  existingProofRecord,
  setExistingProofRecord,
}: Props) {
  const { contentType, createdAt, hash, _id, mainUrl, isPublic, mainThumbnail } =
    existingProofRecord;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  return (
    <Stack className={classes.container}>
      {createdAt && <Text className={classes.date}>{formattedDate}</Text>}{" "}
      <ContentBlurTypeButton
        contentId={_id}
        hash={hash}
        contentCategory={"proof"}
        currentMain={mainUrl}
        position="top-right"
        setRecords={setExistingProofRecord}
        customStyles={{ top: rem(16), right: rem(16) }}
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
          isStatic
        />
      )}
      <ContentPublicityIndicator isPublic={isPublic} />
    </Stack>
  );
}
