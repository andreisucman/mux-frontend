import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Avatar, { AvatarConfig, genConfig } from "react-nice-avatar";
import { Button, ColorInput, Fieldset, rem, Stack } from "@mantine/core";
import { UpdateClubInfoProps } from "@/app/settings/ClubSettings";
import extractGradientColors from "@/helpers/extractGradientColors";
import FilterDropdown from "../FilterDropdown";
import { options } from "./options";
import classes from "./AvatarEditor.module.css";

type Props = {
  canUpdateAvatar: boolean;
  currentConfig: AvatarConfig;
  handleUpdateClubInfo: (updatedAvatar: UpdateClubInfoProps) => void;
};

export default function AvatarEditor({
  canUpdateAvatar,
  currentConfig,
  handleUpdateClubInfo,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [bgColorOne, setBgColorOne] = useState<string>("");
  const [bgColorTwo, setBgColorTwo] = useState<string>("");
  const [updatedAvatar, setUpdatedAvatar] = useState<AvatarConfig>(currentConfig);

  const isDirty = useMemo(() => {
    return JSON.stringify(currentConfig) !== JSON.stringify(updatedAvatar);
  }, [updatedAvatar]);

  const modifyConfig = (key: string, value: string | null | undefined) => {
    if (!value) return;

    setUpdatedAvatar((prev) =>
      genConfig({
        ...prev,
        ...{ [key]: value },
        isGradient: true,
      })
    );
  };

  const createGradient = useCallback(
    (colorOne: string, colorTwo: string) =>
      `linear-gradient(90deg, ${colorOne || colorTwo} 0%, ${colorTwo || colorOne} 100%)`,
    []
  );

  useEffect(() => {
    if (!currentConfig.bgColor) return;
    const gradientColors = extractGradientColors(currentConfig.bgColor);
    setBgColorOne(gradientColors[0]);
    setBgColorOne(gradientColors[1]);
  }, [currentConfig.bgColor]);

  return (
    <Stack className={classes.container}>
      <Avatar {...updatedAvatar} style={{ width: rem(100), height: rem(100), margin: "auto" }} />
      <Stack className={classes.wrapper}>
        <Button
          loading={isLoading}
          disabled={!isDirty || isLoading || !canUpdateAvatar}
          onClick={() =>
            handleUpdateClubInfo({ type: "avatar", data: updatedAvatar, setIsLoading })
          }
        >
          <IconDeviceFloppy className={`${classes.icon} icon`} /> Save
        </Button>
        <Stack className={classes.content}>
          <Fieldset legend="Hat">
            <FilterDropdown
              data={options.hatStyle}
              placeholder="Hat"
              defaultSelected={currentConfig.hatStyle}
              onSelect={(value) => modifyConfig("hatStyle", value)}
            />
            <ColorInput
              flex={1}
              mt={12}
              value={updatedAvatar.hatColor}
              placeholder="Hat color"
              defaultValue={currentConfig.hatColor}
              onChange={(value) => modifyConfig("hatColor", value)}
            />
          </Fieldset>
          <Fieldset legend="Hair">
            <FilterDropdown
              data={options.hairStyle as { label: string; value: string }[]}
              placeholder="Hair"
              defaultSelected={currentConfig.hairStyle}
              onSelect={(value) => modifyConfig("hairStyle", value)}
            />
            <ColorInput
              flex={1}
              mt={12}
              value={updatedAvatar.hairColor}
              placeholder="Hair color"
              defaultValue={currentConfig.hairColor}
              onChange={(value) => modifyConfig("hairColor", value)}
            />
          </Fieldset>
          <Fieldset legend="Ear">
            <FilterDropdown
              data={options.earSize}
              placeholder="Ear"
              defaultSelected={currentConfig.earSize}
              onSelect={(value) => modifyConfig("earSize", value)}
            />
          </Fieldset>
          <Fieldset legend="Eyes">
            <FilterDropdown
              data={options.eyeStyle}
              placeholder="Eyes"
              defaultSelected={currentConfig.eyeStyle}
              onSelect={(value) => modifyConfig("eyeStyle", value)}
            />
          </Fieldset>
          <Fieldset legend="Glasses">
            <FilterDropdown
              data={options.glassesStyle}
              placeholder="Glasses"
              defaultSelected={currentConfig.glassesStyle}
              onSelect={(value) => modifyConfig("glassesStyle", value)}
            />
          </Fieldset>
          <Fieldset legend="Nose">
            <FilterDropdown
              data={options.noseStyle}
              placeholder="Nose"
              defaultSelected={currentConfig.noseStyle}
              onSelect={(value) => modifyConfig("noseStyle", value)}
            />
          </Fieldset>
          <Fieldset legend="Mouth">
            <FilterDropdown
              data={options.mouthStyle}
              placeholder="Mouth"
              defaultSelected={currentConfig.mouthStyle}
              onSelect={(value) => modifyConfig("mouthStyle", value)}
            />
          </Fieldset>
          <Fieldset legend="Shirt">
            <FilterDropdown
              data={options.shirtStyle as { label: string; value: string }[]}
              placeholder="Shirt"
              defaultSelected={currentConfig.shirtStyle}
              onSelect={(value) => modifyConfig("shirtStyle", value)}
            />
            <ColorInput
              flex={1}
              mt={12}
              value={updatedAvatar.shirtColor}
              placeholder="Shirt color"
              defaultValue={currentConfig.shirtColor}
              onChange={(value) => modifyConfig("shirtColor", value)}
            />
          </Fieldset>
          <Fieldset legend="Background">
            <ColorInput
              flex={1}
              value={bgColorOne}
              placeholder="Color one"
              onChange={(value) => {
                setBgColorOne(value);
                modifyConfig("bgColor", createGradient(value, bgColorTwo));
              }}
            />
            <ColorInput
              mt={12}
              flex={1}
              value={bgColorTwo}
              placeholder="Color two"
              onChange={(value) => {
                setBgColorTwo(value);
                modifyConfig("bgColor", createGradient(bgColorOne, value));
              }}
            />
          </Fieldset>
        </Stack>
      </Stack>
    </Stack>
  );
}
