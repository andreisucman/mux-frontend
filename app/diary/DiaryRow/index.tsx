import React, { useMemo } from "react";
import { IconChevronDown, IconChevronUp, IconNote } from "@tabler/icons-react";
import { Collapse, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { formatDate } from "@/helpers/formatDate";
import DiaryTaskRow from "../DiaryTaskRow";
import { DiaryRecordType } from "../type";
import classes from "./DiaryRow.module.css";

type Props = {
  data: DiaryRecordType;
  index: number;
};

export default function DiaryRow({ data, index }: Props) {
  const [containerOpen, { toggle: toggleContainerCollapse }] = useDisclosure(index === 0);
  const [transcriptionOpen, { toggle: toggleTranscriptionCollapse }] = useDisclosure(false);
  const [tasksOpen, { toggle: toggleTasksCollapse }] = useDisclosure(true);

  const { audio, text, createdAt, tasks } = data;

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

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group className={classes.header} onClick={toggleContainerCollapse}>
          <Title order={5} className={classes.title}>
            <IconNote className={`${classes.icon} icon`} /> {formattedDate}
          </Title>
          {containerChevron}
        </Group>

        <Collapse in={containerOpen}>
          <audio src={audio} controls className={classes.audio} />
          <Divider
            label={
              <Group c="dimmed" className={classes.labelGroup} onClick={toggleTasksCollapse}>
                {tasksChevron}
                {tasksLabel}
              </Group>
            }
            m={6}
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
            m={6}
          />
          <Collapse in={transcriptionOpen}>
            <Text>{text}</Text>
          </Collapse>
        </Collapse>
      </Stack>
    </Stack>
  );
}
