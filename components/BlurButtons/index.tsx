import React, { useCallback, useContext } from "react";
import { IconEyeOff, IconMoodOff } from "@tabler/icons-react";
import { Checkbox, Group } from "@mantine/core";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import classes from "./BlurButtons.module.css";

type Props = {
  originalUrl: string;
  disabled: boolean;
  onBlurClick: (...args: any) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function BlurButtons({ disabled, originalUrl, customStyles, onBlurClick }: Props) {
  const { blurType, setBlurType } = useContext(BlurChoicesContext);

  const handleChange = useCallback((checked: boolean, type: BlurTypeEnum) => {
    const newBlurType = checked ? type : BlurTypeEnum.ORIGINAL;
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
        label={
          <Group className={classes.labelGroup}>
            <IconEyeOff className="icon" />
          </Group>
        }
        disabled={disabled}
        onChange={(e) => handleChange(e.currentTarget.checked, BlurTypeEnum.EYES)}
      />
      <Checkbox
        checked={blurType === "face"}
        label={
          <Group className={classes.labelGroup}>
            <IconMoodOff className="icon" />
          </Group>
        }
        disabled={disabled}
        onChange={(e) => handleChange(e.currentTarget.checked, BlurTypeEnum.FACE)}
      />
    </Group>
  );
}
