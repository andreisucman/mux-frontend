import React, { useEffect, useState } from "react";
import { Select, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { normalizeString } from "@/helpers/utils";
import { UserConcernType } from "@/types/global";

type Props = {
  allConcerns: UserConcernType[];
  allParts: string[];
  selectedPart: string | null;
  selectedConcern: string | null;
  setSelectedConcern: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPart: React.Dispatch<React.SetStateAction<string | null>>;
};

type FormattedItem = {
  value: string;
  label: string;
  part?: string;
  concern?: string;
};

export default function CreateATaskContent({
  allConcerns,
  allParts,
  selectedConcern,
  setSelectedConcern,
  selectedPart,
  setSelectedPart,
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
    <Stack>
      <Stack gap={8}>
        <Text size="xs" c="dimmed">
          Relevant concern
        </Text>
        <Select
          data={relevantConcerns}
          value={selectedConcern}
          onChange={(concern) =>
            handleSelect(
              "concern",
              concern,
              relevantConcerns.find((c) => c.value === concern)
            )
          }
          placeholder="Select relevant concern"
          searchable
        />
      </Stack>

      <Stack gap={8}>
        <Text size="xs" c="dimmed">
          Relevant part
        </Text>
        <Select
          data={relevantParts}
          value={selectedPart}
          onChange={(part) =>
            handleSelect(
              "part",
              part,
              relevantParts.find((c) => c.value === part)
            )
          }
          placeholder="Select relevant part"
        />
      </Stack>
    </Stack>
  );
}
