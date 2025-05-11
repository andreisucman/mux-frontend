import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import TextareaComponent from "@/components/TextAreaComponent";

type Props = {
  routineSuggestionId: string;
  streamRoutineSuggestions: (routineSuggestionId: string, revisionText?: string) => void;
};

export default function ReviseRoutineModalContent({
  routineSuggestionId,
  streamRoutineSuggestions,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const handleReviseRoutine = async () => {
    if (isLoading || !text.trim()) return;

    setIsLoading(true);
    await streamRoutineSuggestions(routineSuggestionId, text);
    modals.closeAll();
    setIsLoading(false);
  };

  return (
    <Stack>
      <TextareaComponent
        text={text}
        placeholder="Tell how the routine should be modified"
        setText={setText}
      />
      <Button
        loading={isLoading}
        disabled={isLoading || !text.trim()}
        variant="default"
        onClick={handleReviseRoutine}
      >
        Revise
      </Button>
    </Stack>
  );
}
