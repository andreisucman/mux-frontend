import React, { memo, useMemo } from "react";
import { IconDental, IconMoodNeutral, IconWhirl } from "@tabler/icons-react";
import { Checkbox, Group } from "@mantine/core";
import classes from "./SelectPartsCheckboxes.module.css";

type Props = {
  showMouth: boolean;
  showScalp: boolean;
  showFace: boolean;
  setShowPart: (type: "face" | "mouth" | "scalp", value: boolean) => void;
  distinctUploadedParts: string[];
};

function isUploaded(partName: string, uploadedParts: string[]) {
  return uploadedParts.includes(partName);
}

function SelectPartsCheckboxes({
  showMouth,
  showScalp,
  showFace,
  setShowPart,
  distinctUploadedParts,
}: Props) {
  const faceUploaded = useMemo(() => {
    return isUploaded("face", distinctUploadedParts);
  }, [distinctUploadedParts.length]);

  const mouthUploaded = useMemo(() => {
    return isUploaded("mouth", distinctUploadedParts);
  }, [distinctUploadedParts.length]);

  const scalpUploaded = useMemo(() => {
    return isUploaded("scalp", distinctUploadedParts);
  }, [distinctUploadedParts.length]);

  return (
    <Group className={classes.container}>
      <Checkbox
        checked={faceUploaded || showFace}
        className={classes.checkbox}
        label={
          <Group className={classes.labelGroup}>
            <IconMoodNeutral className="icon" /> Face
          </Group>
        }
        onChange={() => setShowPart("face", !showFace)}
        styles={{
          labelWrapper: { width: "100%" },
          root: { width: "100%" },
          label: { paddingLeft: "0.35rem" },
          body: { alignItems: "center" },
        }}
      />
      <Checkbox
        checked={mouthUploaded || showMouth}
        className={classes.checkbox}
        label={
          <Group className={classes.labelGroup}>
            <IconDental className="icon" /> Mouth
          </Group>
        }
        onChange={() => setShowPart("mouth", !showMouth)}
        styles={{
          labelWrapper: { width: "100%" },
          root: { width: "100%" },
          label: { paddingLeft: "0.35rem" },
          body: { alignItems: "center" },
        }}
      />
      <Checkbox
        checked={scalpUploaded || showScalp}
        className={classes.checkbox}
        label={
          <Group className={classes.labelGroup}>
            <IconWhirl className="icon" /> Scalp
          </Group>
        }
        onChange={() => setShowPart("scalp", !showScalp)}
        styles={{
          labelWrapper: { width: "100%" },
          root: { width: "100%" },
          label: { paddingLeft: "0.35rem" },
          body: { alignItems: "center" },
        }}
      />
    </Group>
  );
}

export default memo(SelectPartsCheckboxes);
