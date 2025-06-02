import React, { useRef, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, LoadingOverlay, rem, Stack, Title } from "@mantine/core";
import RecordingButton from "@/app/club/RecordingButton";
import TextareaComponent from "@/components/TextAreaComponent";
import classes from "./AnswerBox.module.css";

type Props = {
  title: string;
  textObjectKey: string;
  textObject: { [key: string]: any };
  handleType: (str: string) => void;
  handleDelete?: () => void;
  isDisabled: boolean;
  placeholder?: string;
};

export default function AnswerBox({
  textObjectKey,
  isDisabled,
  placeholder,
  textObject,
  title,
  handleDelete,
  handleType,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  return (
    <Stack className={classes.container}>
      <Group flex={1} gap={8}>
        {handleDelete && (
          <ActionIcon variant="default" onClick={handleDelete} mr={4}>
            <IconTrash size={16} />
          </ActionIcon>
        )}
        <Title order={5}>{title}</Title>
        <RecordingButton
          mediaRecorderRef={mediaRecorderRef}
          mediaStreamRef={mediaStreamRef}
          setIsLoading={setIsLoading}
          setText={(text: string) => handleType(text)}
          customContainerStyles={{ marginLeft: "auto" }}
          size="compact-xs"
          buttonText="Quick answer with voice"
          defaultRecordingMs={60000}
          isDisabled={isDisabled}
          transcribeOnEnd
        />
      </Group>
      <Stack className={classes.wrapper}>
        <LoadingOverlay visible={isLoading} />
        <TextareaComponent
          text={textObject[textObjectKey]}
          customStyles={{ minHeight: rem(150) }}
          placeholder={placeholder || "Your answer to the question"}
          setText={(text: string) => handleType(text)}
          readOnly={isDisabled}
        />
      </Stack>
    </Stack>
  );
}
