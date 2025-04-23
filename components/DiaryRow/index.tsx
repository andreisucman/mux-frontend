import React, { useCallback, useRef, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openErrorModal from "@/helpers/openErrorModal";
import { DiaryType } from "../../app/diary/type";
import ControlButtons from "./ControlButtons";
import DiaryActivityRow from "./DiaryActivityRow";
import classes from "./DiaryRow.module.css";

type Props = {
  data: DiaryType;
  index: number;
};

export default function DiaryRow({ data }: Props) {
  const [diaryRecord, setDiaryRecord] = useState<DiaryType>(data);
  const [isUploading, setIsUploading] = useState(false);
  const [transcriptionOpen, { toggle: toggleTranscriptionCollapse }] = useDisclosure(false);
  const [tasksOpen, { toggle: toggleTasksCollapse }] = useDisclosure(true);
  const [showRecordButton, setShowRecordButton] = useState(true);

  const { audio, transcriptions, activity } = diaryRecord;

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
      if (isUploading) return;

      try {
        setIsUploading(true);

        const audioUrls = await uploadToSpaces({ itemsArray: blobs });

        const response = await callTheServer({
          endpoint: "saveDiaryRecord",
          method: "POST",
          body: {
            audio: audioUrls?.[0],
            part: data.part,
            concern: data.concern,
            activity: data.activity,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            return;
          }
          setDiaryRecord(response.message);
          setShowRecordButton(true);
        } else {
          openErrorModal();
        }
      } catch (err) {
        openErrorModal();
      } finally {
        setIsUploading(false);
      }
    },
    [isUploading, data]
  );

  return (
    <Stack className={classes.container}>
      {showRecordButton && <ControlButtons isLoading={isUploading} onSubmit={handleSubmit} />}
      {audio.length > 0 && (
        <Stack className={classes.audoStack}>
          {audio.map((obj, i) => (
            <audio key={i} src={obj.url} controls className={classes.audio} />
          ))}
        </Stack>
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
      {transcriptions.length > 0 && (
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
            <Stack className={classes.transcriptionStack}>
              {transcriptions.map((obj, i) => (
                <Text key={i}>{obj.text}</Text>
              ))}
            </Stack>
          </Collapse>
        </>
      )}
    </Stack>
  );
}
