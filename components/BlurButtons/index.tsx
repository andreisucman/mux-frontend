import React, { useCallback, useContext } from "react";
import { IconEyeOff, IconMoodOff } from "@tabler/icons-react";
import { Checkbox, Group } from "@mantine/core";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import classes from "./BlurButtons.module.css";

type Props = {
  originalUrl: string;
  disabled: boolean;
  onBlurClick: (...args: any) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function BlurButtons({ disabled, originalUrl, customStyles, onBlurClick }: Props) {
  const { blurType, setBlurType } = useContext(BlurChoicesContext);

  const handleChange = useCallback((checked: boolean, type: "face" | "eyes" | "original") => {
    const newBlurType = checked ? type : "original";
    setBlurType(newBlurType);
    onBlurClick({
      originalUrl,
      blurType: newBlurType,
    });
  }, []);

  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      <Checkbox
        checked={blurType === "eyes"}
        className={classes.checkbox}
        classNames={{
          body: classes.body,
          label: classes.label,
          labelWrapper: classes.labelWrapper,
          root: classes.root,
        }}
        label={
          <Group className={classes.labelGroup}>
            <IconEyeOff className="icon" /> Blur eyes
          </Group>
        }
        disabled={disabled}
        onChange={(e) => handleChange(e.currentTarget.checked, "eyes")}
      />
      <Checkbox
        checked={blurType === "face"}
        className={classes.checkbox}
        classNames={{
          body: classes.body,
          label: classes.label,
          labelWrapper: classes.labelWrapper,
          root: classes.root,
        }}
        label={
          <Group className={classes.labelGroup}>
            <IconMoodOff className="icon" /> Blur face
          </Group>
        }
        disabled={disabled}
        onChange={(e) => handleChange(e.currentTarget.checked, "face")}
      />
    </Group>
  );
}
