import React, { useCallback, useState } from "react";
import { IconBolt, IconDeviceFloppy } from "@tabler/icons-react";
import { Button, Group, rem, SegmentedControl, Stack, Tooltip } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import callTheServer from "@/functions/callTheServer";
import askConfirmation from "@/helpers/askConfirmation";
import openErrorModal from "@/helpers/openErrorModal";
import { ClubUserType } from "@/types/global";
import { aboutSegments } from "../data";
import classes from "./EditClubAbout.module.css";

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
};

type Props = {
  hasAboutAnswers: boolean;
  hasNewAboutQuestions: boolean;
  youData: ClubUserType | null;
  bioData: BioDataType;
  isSelf: boolean;
  updateClubBio: (dirtyParts: string[], bioData: BioDataType) => Promise<void>;
  setBioData: React.Dispatch<React.SetStateAction<BioDataType>>;
};

export default function EditClubAbout({
  hasAboutAnswers,
  hasNewAboutQuestions,
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

  const { bio } = youData || {};
  const { nextRegenerateBio } = bio || {};

  const nextDate = nextRegenerateBio && nextRegenerateBio[showSegment as "philosophy"];
  const canRegenerate = !nextDate || new Date(nextDate) <= new Date();

  const tooltipLabel = !hasAboutAnswers
    ? "Answer questions first"
    : canRegenerate
      ? ""
      : `Next after ${new Date(nextDate).toDateString()}.`;

  const generateBioFromQuestions = useCallback(
    async (segment: string) => {
      try {
        const response = await callTheServer({
          endpoint: "generateBioFromQuestions",
          method: "POST",
          body: { segment },
        });

        if (response.status === 200) {
          setBioData((prev: any) => ({
            ...(prev || {}),
            [showSegment]: response.message,
          }));
        }
      } catch (err) {}
    },
    [bioData, canRegenerate]
  );

  const handleGenerateBioFromQuestions = useCallback(
    (segment: string) => {
      if (canRegenerate) {
        askConfirmation({
          title: "Please confirm",
          body: "You can only generate bio from questions once a week. Continue?",
          onConfirm: () => generateBioFromQuestions(segment),
        });
      } else {
        openErrorModal({
          description: `You can regenerate ${segment} after ${new Date(nextDate).toDateString()}`,
        });
      }
    },
    [youData]
  );

  return (
    <Stack className={classes.wrapper}>
      <SegmentedControl data={aboutSegments} value={showSegment} onChange={setShowSegment} />
      <TextareaComponent
        text={bioData[showSegment as keyof BioDataType]}
        setText={(text) =>
          setBioData((prev: any) => ({
            ...(prev || {}),
            [showSegment]: text,
          }))
        }
        placeholder={`Your ${showSegment}`}
        readOnly={!isSelf}
        isUnbounded
      />

      {isSelf && (
        <Group className={classes.buttons}>
          {(hasAboutAnswers || hasNewAboutQuestions) && (
            <Tooltip label={tooltipLabel} disabled={false}>
              <Button
                className={classes.generateButton}
                disabled={!hasAboutAnswers}
                onClick={() => handleGenerateBioFromQuestions(showSegment)}
              >
                <IconBolt className="icon" style={{ marginRight: rem(6) }} /> Generate from answers
              </Button>
            </Tooltip>
          )}

          <Button
            className={classes.saveButton}
            onClick={() => updateClubBio(dirtyParts as string[], bioData)}
            disabled={dirtyParts.length === 0 || !isSelf}
          >
            <IconDeviceFloppy className="icon" style={{ marginRight: rem(6) }} />
            Save
          </Button>
        </Group>
      )}
    </Stack>
  );
}
