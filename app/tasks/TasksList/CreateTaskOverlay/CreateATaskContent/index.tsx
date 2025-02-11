import React, { useMemo } from "react";
import { Select, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import TextareaComponent from "@/components/TextAreaComponent";
import { normalizeString } from "@/helpers/utils";
import { UserConcernType } from "@/types/global";

type Props = {
  allConcerns?: UserConcernType[];
  allParts: string[];
  selectedPart: string | null;
  selectedConcern: string | null;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setSelectedConcern: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedPart: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function CreateATaskContent({
  allConcerns,
  allParts,
  selectedConcern,
  setSelectedConcern,
  selectedPart,
  setSelectedPart,
  description,
  setDescription,
}: Props) {
  const formattedConcerns = useMemo(() => {
    return allConcerns?.map((co) => ({ label: normalizeString(co.name), value: co.name }));
  }, [allConcerns]);

  const formattedParts = useMemo(() => {
    return allParts.map((name) => ({ label: upperFirst(name), value: name }));
  }, [allParts]);

  return (
    <Stack>
      <TextareaComponent
        text={description}
        setText={setDescription}
        placeholder={"Moisturizing face with coconut oil to combat dullness"}
      />
      <Select
        data={formattedConcerns}
        value={selectedConcern}
        onChange={setSelectedConcern}
        placeholder="Select relevant concern"
        searchable
      />
      <Select
        data={formattedParts}
        value={selectedPart}
        onChange={setSelectedPart}
        placeholder="Select relevant part"
      />
    </Stack>
  );
}
