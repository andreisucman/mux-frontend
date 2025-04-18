import React, { useEffect, useState } from "react";
import { rem, Select, Stack, Text, TextInput } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ToCompleteInput from "@/components/ToCompleteInput";
import { normalizeString } from "@/helpers/utils";
import { UserConcernType } from "@/types/global";

type Props = {
  exampleVideoId: string;
  allConcerns: UserConcernType[];
  allParts: string[];
  selectedPart: string | null;
  taskName: string;
  selectedConcern: string | null;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedConcern: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPart: React.Dispatch<React.SetStateAction<string | null>>;
  setExampleVideoId: React.Dispatch<React.SetStateAction<string>>;
};

type FormattedItem = {
  value: string;
  label: string;
  part?: string;
  concern?: string;
};

export default function CreateATaskContent({
  error,
  taskName,
  allConcerns,
  allParts,
  selectedConcern,
  selectedPart,
  exampleVideoId,
  setError,
  setTaskName,
  setExampleVideoId,
  setSelectedPart,
  setSelectedConcern,
}: Props) {
  const [formattedConcerns, setFormattedConcerns] = useState<FormattedItem[]>([]);
  const [formattedParts, setFormattedParts] = useState<FormattedItem[]>([]);
  const [relevantConcerns, setRelevantConcerns] = useState<FormattedItem[]>([]);
  const [relevantParts, setRelevantParts] = useState<FormattedItem[]>([]);

  useEffect(() => {
    if (allConcerns.length > 0) {
      const formattedConcerns = allConcerns.map((co) => ({
        label: normalizeString(co.name),
        value: co.name,
        part: co.part,
      }));
      setFormattedConcerns(formattedConcerns);
      setRelevantConcerns(formattedConcerns);
    }

    if (allParts.length > 0) {
      const formattedParts = allParts.map((name) => ({
        label: upperFirst(name),
        value: name,
        part: name,
      }));
      setFormattedParts(formattedParts);
      setRelevantParts(formattedParts);
    }
  }, [allConcerns.length, allParts.length]);

  const resetState = (type: "concern" | "part") => {
    if (type === "concern") {
      setSelectedConcern(null);

      if (!selectedPart) {
        setRelevantConcerns(formattedConcerns);
        setRelevantParts(formattedParts);
      }
    }

    if (type === "part") {
      setSelectedPart(null);

      if (!selectedConcern) {
        setRelevantParts(formattedParts);
        setRelevantConcerns(formattedConcerns);
      }
    }
  };

  const handleSelect = (
    type: "concern" | "part",
    value: string | null,
    selectedItem?: FormattedItem
  ) => {
    if (value === null) {
      resetState(type);
      return;
    }

    if (type === "concern") {
      const relevantParts = formattedParts.filter((part) => part.value === selectedItem?.part);
      setRelevantParts(relevantParts);
      setSelectedConcern(value);
    }
    if (type === "part") {
      const relevantConcerns = formattedConcerns.filter((c) => c.part === selectedItem?.part);
      setRelevantConcerns(relevantConcerns);
      setSelectedPart(value);
    }
  };

  return (
    <Stack gap={8}>
      <Select
        data={relevantParts}
        value={selectedPart}
        disabled={relevantParts.length === 0}
        label={
          <Text size="xs" c="dimmed" component="span">
            Relevant part
          </Text>
        }
        onChange={(part) =>
          handleSelect(
            "part",
            part,
            relevantParts.find((c) => c.value === part)
          )
        }
        withAsterisk
        placeholder="Select relevant part"
      />
      <Select
        data={relevantConcerns}
        value={selectedConcern}
        disabled={relevantConcerns.length === 0}
        label={
          <Text size="xs" c="dimmed" component="span">
            Relevant concern
          </Text>
        }
        onChange={(concern) =>
          handleSelect(
            "concern",
            concern,
            relevantConcerns.find((c) => c.value === concern)
          )
        }
        placeholder="Select relevant concern"
        withAsterisk
      />
      <TextInput
        label={
          <Text size="xs" c="dimmed" component="span">
            Task name
          </Text>
        }
        disabled={relevantParts.length === 0}
        error={error}
        value={taskName}
        rightSection={<Text size="sm">{taskName.trim().length}</Text>}
        onChange={(e) => {
          setTaskName(e.currentTarget.value);
          setError("");
        }}
        placeholder="Enter task name"
        withAsterisk
      />
      <ToCompleteInput
        title={"Embeddable video id (optional)"}
        placeholder="Video id"
        prefix="https://www.youtube.com/embed/"
        value={exampleVideoId}
        setValue={setExampleVideoId}
        customStyles={{ marginTop: rem(6) }}
        isDisabled={relevantParts.length === 0}
      />
    </Stack>
  );
}
