import React, { useCallback, useState } from "react";
import { Button, Group, Stack, Tooltip } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import callTheServer from "@/functions/callTheServer";
import askConfirmation from "@/helpers/askConfirmation";
import openErrorModal from "@/helpers/openErrorModal";
import { ClubUserType } from "@/types/global";
import classes from "./EditClubAbout.module.css";

type Props = {
  hasAboutAnswers?: boolean;
  hasNewAboutQuestions?: boolean;
  youData: ClubUserType | null;
  about: string;
  isSelf: boolean;
  updateClubBio: (
    about: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  setAbout: React.Dispatch<React.SetStateAction<string>>;
  setYouData: React.Dispatch<React.SetStateAction<ClubUserType>>;
};

export default function EditClubAbout({
  hasAboutAnswers,
  hasNewAboutQuestions,
  youData,
  about,
  isSelf,
  updateClubBio,
  setAbout,
  setYouData,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { bio } = youData || {};
  const { about: existingAbout, nextRegenerateBio } = bio || {};

  const isDirty = existingAbout !== about;

  const canRegenerate = !nextRegenerateBio || new Date(nextRegenerateBio) <= new Date();

  const tooltipLabel = !hasAboutAnswers
    ? "Answer questions first"
    : canRegenerate
      ? ""
      : `Next after ${new Date(nextRegenerateBio).toDateString()}.`;

  const generateBioFromQuestions = useCallback(
    async (setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
      try {
        setIsLoading(true);

        const response = await callTheServer({
          endpoint: "generateBioFromQuestions",
          method: "POST",
        });

        if (response.status === 200) {
          const { content, nextRegenerateBio } = response.message;

          setAbout(content);

          setYouData((prev: ClubUserType) => {
            return {
              ...prev,
              nextRegenerateBio,
            };
          });
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    },
    [youData]
  );

  const handleGenerateBioFromQuestions = useCallback(() => {
    if (isLoading) return;

    if (canRegenerate) {
      askConfirmation({
        title: "Please confirm",
        body: "You can do it once a week only. Continue?",
        onConfirm: () => generateBioFromQuestions(setIsLoading),
      });
    } else {
      openErrorModal({
        description: `You can regenerate your bio after ${new Date(nextRegenerateBio).toDateString()}`,
      });
    }
  }, [youData, nextRegenerateBio, isLoading, canRegenerate]);

  return (
    <Stack className={classes.wrapper}>
      <TextareaComponent
        text={about}
        setText={setAbout}
        placeholder={"About you"}
        readOnly={!isSelf}
        isLoading={isLoading}
        isUnbounded
      />

      {isSelf && (
        <Group className={classes.buttons}>
          {(hasAboutAnswers || hasNewAboutQuestions) && (
            <Tooltip label={tooltipLabel} disabled={!!canRegenerate}>
              <Button
                className={classes.generateButton}
                disabled={!hasAboutAnswers || !canRegenerate || isLoading}
                onClick={() => handleGenerateBioFromQuestions()}
              >
                Generate from answers
              </Button>
            </Tooltip>
          )}

          <Button
            className={classes.saveButton}
            onClick={() => updateClubBio(about, setIsLoading)}
            disabled={!isDirty || !isSelf || isLoading}
          >
            Save
          </Button>
        </Group>
      )}
    </Stack>
  );
}
