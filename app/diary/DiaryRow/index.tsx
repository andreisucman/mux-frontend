import React, { useCallback, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import { DiaryRecordType } from "../type";
import ControlButtons from "./ControlButtons";
import DiaryActivityRow from "./DiaryActivityRow";
import classes from "./DiaryRow.module.css";

type Props = {
  data: DiaryRecordType;
  index: number;
  type: TypeEnum;
};

export default function DiaryRow({ data, type, index }: Props) {
  const [diaryRecord, setDiaryRecord] = useState<DiaryRecordType>(data);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionOpen, { toggle: toggleTranscriptionCollapse }] = useDisclosure(false);
  const [tasksOpen, { toggle: toggleTasksCollapse }] = useDisclosure(true);

  const { audio, transcription, activity } = diaryRecord;

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

  const tasksLabel = tasksOpen ? "Hide activity" : "Show activity";
  const transcriptionLabel = transcriptionOpen ? "Hide transcription" : "Show transcription";

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
          body: { audio: audioUrls[0], type, activity: data.activity },
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

  return (
    <Stack className={classes.container}>
      {audio ? (
        <audio src={audio || ""} controls className={classes.audio} />
      ) : (
        <ControlButtons isLoading={isUploading} onSubmit={handleSubmit} />
      )}
      {activity.length > 0 && (
        <>
          <Divider
            label={
              <Group c="dimmed" className={classes.labelGroup} onClick={toggleTasksCollapse}>
                {tasksChevron}
                {tasksLabel}
              </Group>
            }
          />
          <Collapse in={tasksOpen}>
            <DiaryActivityRow activities={activity} />
          </Collapse>
        </>
      )}

      {transcription && (
        <>
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
        </>
      )}
    </Stack>
  );
}
