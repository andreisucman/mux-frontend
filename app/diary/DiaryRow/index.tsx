import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconChevronDown, IconChevronUp, IconNote } from "@tabler/icons-react";
import { Collapse, Divider, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TypeEnum } from "@/types/global";
import DiaryTaskRow from "../DiaryTaskRow";
import { DiaryRecordType } from "../type";
import ControlButtons from "./ControlButtons";
import classes from "./DiaryRow.module.css";

type Props = {
  data: DiaryRecordType;
  index: number;
  type: TypeEnum;
};

export default function DiaryRow({ data, type, index }: Props) {
  const [diaryRecord, setDiaryRecord] = useState<DiaryRecordType>(data);
  const [isUploading, setIsUploading] = useState(false);
  const [containerOpen, { toggle: toggleContainerCollapse }] = useDisclosure(index === 0);
  const [transcriptionOpen, { toggle: toggleTranscriptionCollapse }] = useDisclosure(false);
  const [tasksOpen, { toggle: toggleTasksCollapse }] = useDisclosure(true);

  const { audio, transcription, createdAt, tasks } = diaryRecord;

  const containerChevron = containerOpen ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  const transcriptionChevron = transcriptionOpen ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  const tasksChevron = tasksOpen ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  const tasksLabel = tasksOpen ? "Hide tasks" : "Show tasks";
  const transcriptionLabel = transcriptionOpen ? "Hide transcription" : "Show transcription";
  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  const handleSubmit = useCallback(
    async (blobs: Blob[] | null) => {
      if (!blobs) return;
      if (!type) return;
      if (isUploading) return;

      try {
        setIsUploading(true);

        const audioUrls = await uploadToSpaces({ itemsArray: blobs });

        const response = await callTheServer({
          endpoint: "saveDiaryRecord",
          method: "POST",
          body: { audio: audioUrls[0], taskIds: data.tasks.map((t) => t._id), type },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            return;
          }
          const { audio, transcription, createdAt } = response.message;
          setDiaryRecord({ ...data, audio, transcription, createdAt });
        } else {
          setIsUploading(false);
          openErrorModal();
        }
      } catch (err) {
        setIsUploading(false);
        openErrorModal();
        console.log("Error in handleSubmit: ", err);
      }
    },
    [isUploading]
  );

  const showSkeleton = useShowSkeleton();

  return (
    <Stack className={classes.container}>
      <Group className={classes.header} onClick={toggleContainerCollapse}>
        <Title order={5} className={classes.title}>
          <IconNote className={`${classes.icon} icon`} /> {formattedDate}
        </Title>
        {containerChevron}
      </Group>
      <Collapse in={containerOpen}>
        <Stack>
          {audio ? (
            <audio src={audio || ""} controls className={classes.audio} />
          ) : (
            <ControlButtons isLoading={isUploading} onSubmit={handleSubmit} />
          )}
          <Divider
            label={
              <Group c="dimmed" className={classes.labelGroup} onClick={toggleTasksCollapse}>
                {tasksChevron}
                {tasksLabel}
              </Group>
            }
          />
          <Collapse in={tasksOpen}>
            {tasks.map((task, index) => (
              <DiaryTaskRow {...task} key={String(index)} />
            ))}
          </Collapse>
          <Divider
            label={
              <Group
                c="dimmed"
                className={classes.labelGroup}
                onClick={toggleTranscriptionCollapse}
              >
                {transcriptionChevron}
                {transcriptionLabel}
              </Group>
            }
          />
          <Collapse in={transcriptionOpen}>
            <Text>{transcription}</Text>
          </Collapse>
        </Stack>
      </Collapse>
    </Stack>
  );
}
