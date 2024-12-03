import React, { memo, useCallback, useEffect, useState } from "react";
import { Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import ProofCard from "@/app/results/proof/ProofGallery/ProofCard";
import { SimpleProofType } from "@/app/results/proof/types";
import callTheServer from "@/functions/callTheServer";
import fetchUsersProof from "@/functions/fetchUsersProof";
import classes from "./AccordionRoutineVideoRow.module.css";

type Props = {
  routineId: string;
  taskKey: string;
  isSelf: boolean;
};

function AccordionRoutineVideoRow({ routineId, taskKey, isSelf }: Props) {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const [videos, setVideos] = useState<SimpleProofType[]>();

  const getProofVideos = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: `getUsersProofRecords?routineId=${routineId}&taskKey=${taskKey}`,
        method: "GET",
      });

      if (response.status === 200) {
        const updated = response.message.map((video: SimpleProofType) => ({
          ...video,
          isLite: true,
        }));
        setVideos(updated);
      }
    } catch (err) {
      console.log("Error in getProofVideos: ", err);
    }
  }, [routineId, taskKey]);

  useEffect(() => {
    getProofVideos();
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        {videos?.map((video) => (
          <ProofCard
            data={video}
            key={video._id}
            isMobile={!!isMobile}
            setProof={setVideos}
            isSelf={isSelf}
          />
        ))}
      </Group>
    </Group>
  );
}

export default memo(AccordionRoutineVideoRow);
