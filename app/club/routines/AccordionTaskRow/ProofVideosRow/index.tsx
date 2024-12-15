import React, { memo } from "react";
import { Group } from "@mantine/core";
import ProofCard from "@/app/results/proof/ProofGallery/ProofCard";
import { SimpleProofType } from "@/app/results/proof/types";
import classes from "./ProofVideosRow.module.css";

type Props = {
  proofVideos: SimpleProofType[];
  isMobile: boolean;
};

function ProofVideosRow({ proofVideos, isMobile }: Props) {
  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        {proofVideos?.map((video) => (
          <ProofCard data={video} key={video._id} isMobile={!!isMobile} />
        ))}
      </Group>
    </Group>
  );
}

export default memo(ProofVideosRow);
