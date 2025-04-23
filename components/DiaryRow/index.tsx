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
  isPublic: boolean;
  index: number;
};

export default function DiaryRow({ data, isPublic }: Props) {
  const [diaryRecord, setDiaryRecord] = useState<DiaryType>(data);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingsOpen, { toggle: toggleRecordingCollapse }] = useDisclosure(false);
  const [transcriptionOpen, { toggle: toggleTranscriptionCollapse }] = useDisclosure(false);
  const [tasksOpen, { toggle: toggleTasksCollapse }] = useDisclosure(true);
  const [showRecordButton, setShowRecordButton] = useState(true);

  const { audio, transcriptions, activity } = diaryRecord;

  const recordingChevron = recordingsOpen ? (
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

  const tasksLabel = tasksOpen ? "Hide activity" : "Show activity";
  const transcriptionLabel = transcriptionOpen ? "Hide transcription" : "Show transcription";
  const recordingLabel = transcriptionOpen ? "Hide recording" : "Show recordings";

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
      {showRecordButton && !isPublic && (
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
      {audio.length > 0 && (
        <>
          <Divider
            label={
              <Group c="dimmed" className={classes.labelGroup} onClick={toggleRecordingCollapse}>
                {recordingChevron}
                {recordingLabel}
              </Group>
            }
          />
          <Collapse in={recordingsOpen}>
            <Stack className={classes.audoStack}>
              {audio.map((obj, i) => (
                <audio key={i} src={obj.url} controls className={classes.audio} />
              ))}
            </Stack>
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
