import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconBinoculars } from "@tabler/icons-react";
import { ActionIcon, Collapse, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { SimpleProofType } from "@/app/results/proof/types";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import callTheServer from "@/functions/callTheServer";
import { AllTaskType, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
import ProofVideosRow from "./ProofVideosRow";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  type: TypeEnum;
  data: AllTaskType;
  routineId: string;
  onClick: (task: AllTaskType, routineId: string) => void;
};

export default function AccordionTaskRow({ routineId, data, onClick }: Props) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [proofVideos, setProofVideos] = useState();
  const isMobile = useMediaQuery("(max-width: 36em)");
  const { icon, color, name, total, completed } = data;

  const handleGroupClick = useCallback(() => {
    if (data.completed > 0) {
      setOpenCollapse((prev) => !prev);
    }
  }, [data.completed]);

  const handleIconClick = useCallback((e: any, data: AllTaskType, routineId: string) => {
    e.stopPropagation();
    onClick(data, routineId);
  }, []);

  const getProofVideos = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: `getUsersProofRecords?routineId=${routineId}&taskKey=${data.key}`,
        method: "GET",
      });

      if (response.status === 200) {
        const updated = response.message.map((video: SimpleProofType) => ({
          ...video,
          isLite: true,
        }));
        setProofVideos(updated);
      }
    } catch (err) {
      console.log("Error in getProofVideos: ", err);
    }
  }, [routineId, data.key]);

  useEffect(() => {
    getProofVideos();
  }, []);

  const completionRate = useMemo(() => Math.round((completed / total) * 100), [total, completed]);

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper} onClick={handleGroupClick}>
        <Group className={classes.title}>
          <ActionIcon
            variant="default"
            size="sm"
            onClick={(e) => handleIconClick(e, data, routineId)}
          >
            <IconBinoculars className={"icon icon__small"} />
          </ActionIcon>
          <IconWithColor icon={icon} color={color} />
          <Text className={classes.name} lineClamp={2}>
            {name}
          </Text>
        </Group>
        <StatsGroup
          completed={completed}
          completionRate={completionRate}
          total={total}
          isChild={true}
        />
      </Group>
      {proofVideos && (
        <Collapse in={openCollapse}>
          <ProofVideosRow proofVideos={proofVideos} isMobile={!!isMobile} />
        </Collapse>
      )}
    </Stack>
  );
}
