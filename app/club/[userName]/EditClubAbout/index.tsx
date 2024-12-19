import React, { useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Button, rem, SegmentedControl, Stack } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import { ClubUserType } from "@/types/global";
import { segments } from "../segments";
import classes from "./EditClubAbout.module.css";

export type AboutQuestionType = {
  question: string;
  asking: string;
};

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
};

type Props = {
  questions?: AboutQuestionType[];
  youData: ClubUserType | null;
  bioData: BioDataType;
  isSelf: boolean;
  updateClubBio: (dirtyParts: string[], bioData: BioDataType) => Promise<void>;
  setBioData: React.Dispatch<React.SetStateAction<BioDataType>>;
};

export default function EditClubAbout({
  questions,
  youData,
  bioData,
  isSelf,
  updateClubBio,
  setBioData,
}: Props) {
  const [showSegment, setShowSegment] = useState("philosophy");

  const dirtyParts = Object.keys(bioData)
    .map((key) =>
      bioData[key as keyof BioDataType] === (youData?.bio as { [key: string]: any })?.[key]
        ? null
        : key
    )
    .filter(Boolean);

  const currentSegment = segments.find((segment) => segment.value === showSegment) || segments[0];
  const editingDisabled = !isSelf || (questions && questions?.length > 0);

  return (
    <Stack className={classes.wrapper}>
      <SegmentedControl data={segments} value={showSegment} onChange={setShowSegment} />
      <TextareaComponent
        text={bioData[currentSegment.value as keyof BioDataType]}
        setText={(text) =>
          setBioData((prev: any) => ({
            ...(prev || {}),
            [currentSegment.value]: text,
          }))
        }
        placeholder={`Your ${currentSegment.value}`}
        readOnly={editingDisabled}
        isUnbounded
      />

      {isSelf && (
        <Button
          w="100%"
          onClick={() => updateClubBio(dirtyParts as string[], bioData)}
          disabled={dirtyParts.length === 0 || editingDisabled}
        >
          <IconDeviceFloppy style={{ marginRight: rem(4), width: rem(20), height: rem(20) }} />
          Save
        </Button>
      )}
    </Stack>
  );
}
