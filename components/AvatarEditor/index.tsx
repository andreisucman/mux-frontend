import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { micah } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Button, ColorInput, Fieldset, Loader, rem, Stack, Text } from "@mantine/core";
import { UpdateClubInfoProps } from "@/app/settings/ClubSettings";
import { AvatarType } from "@/types/global";
import AvatarComponent from "../AvatarComponent";
import FilterDropdown from "../FilterDropdown";
import { options } from "./options";
import { AvatarConfig } from "./types";
import classes from "./AvatarEditor.module.css";

type Props = {
  canUpdateAvatar: boolean;
  avatar?: AvatarType | null;
  handleUpdateClubInfo: (props: UpdateClubInfoProps) => void;
};

export default function AvatarEditor({ canUpdateAvatar, avatar, handleUpdateClubInfo }: Props) {
  const { config: currentConfig, image } = avatar || {};
  const [isLoading, setIsLoading] = useState(false);
  const [bgColorOne, setBgColorOne] = useState<string>("");
  const [bgColorTwo, setBgColorTwo] = useState<string>("");
  const [updatedConfig, setUpdatedConfig] = useState<AvatarConfig | undefined>(currentConfig);
  const [avatarImage, setAvatarImage] = useState<string | undefined>(image);


  const isDirty = useMemo(() => {
    return JSON.stringify(currentConfig) !== JSON.stringify(updatedConfig);
  }, [updatedConfig]);

  const sanitizeValue = (value: any) => {
    if (typeof value === "string") return value.split("#").join("");
    return value;
  };

  const modifyConfig = (key: string, value: any) => {
    setUpdatedConfig((prev: AvatarConfig | undefined) => {
      const newPayload: AvatarConfig = {
        ...(prev || {}),
        [key]: value,
      };

      console.log("key", key, "value", value);

      const image = createAvatar(micah, newPayload).toDataUri();
      setAvatarImage(image);

      console.log("new image", image);

      return newPayload;
    });
  };

  useEffect(() => {
    if (!currentConfig || !currentConfig.backgroundColor) return;
    setBgColorOne(currentConfig.backgroundColor[0]);
    setBgColorTwo(currentConfig.backgroundColor[1]);
  }, [currentConfig]);

  const dropdownStyles = useMemo(
    () => ({
      maxWidth: "unset",
    }),
    []
  );

  if (!currentConfig || !updatedConfig)
    return (
      <Stack flex={1}>
        <Loader m="auto" />
      </Stack>
    );

  return (
    <Stack className={classes.container}>
      <AvatarComponent
        avatar={{ config: updatedConfig, image: avatarImage || "" }}
        customStyles={{ width: rem(100), height: rem(100), margin: "auto" }}
      />
      <Text size="sm" c="dimmed" ta="center">
        Avatar design by{" "}
        <Link style={{ textDecoration: "underline" }} href="https://dribbble.com/micahlanier">
          Micah Lanier
        </Link>
        .
      </Text>
      <Stack className={classes.wrapper}>
        <Button
          loading={isLoading}
          disabled={!isDirty || isLoading || !canUpdateAvatar || !updatedConfig}
          onClick={() => {
            if (!updatedConfig || !avatarImage) return;
            handleUpdateClubInfo({
              type: "avatar",
              data: { image: avatarImage, config: updatedConfig },
              setIsLoading,
            });
          }}
        >
          Save
        </Button>
        <Stack className={`${classes.content} scrollbar`}>
          <Fieldset legend="Skin color" className={classes.filedset}>
            <ColorInput
              flex={1}
              disabled={!updatedConfig}
              withEyeDropper={false}
              value={`#${updatedConfig.baseColor?.[0]}`}
              placeholder="Skin color"
              defaultValue={`#${updatedConfig.baseColor?.[0]}`}
              onChange={(value) => modifyConfig("baseColor", [sanitizeValue(value)])}
            />
          </Fieldset>
          <Fieldset legend="Hair" className={classes.filedset}>
            <FilterDropdown
              data={options.hair as { label: string; value: string }[]}
              placeholder="Hair"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.hair?.[0]}
              onSelect={(value) => modifyConfig("hair", value ? [value] : undefined)}
              closeOnSelect={false}
              allowDeselect
            />
            <ColorInput
              flex={1}
              mt={12}
              withEyeDropper={false}
              value={`#${updatedConfig.hairColor?.[0]}`}
              placeholder="Hair color"
              onChange={(value) => modifyConfig("hairColor", [sanitizeValue(value)])}
            />
          </Fieldset>
          <Fieldset legend="Ears" className={classes.filedset}>
            <FilterDropdown
              data={options.ears}
              placeholder="Ears"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.ears?.[0]}
              onSelect={(value) => modifyConfig("ears", value ? [value] : undefined)}
            />
          </Fieldset>
          <Fieldset legend="Eyes" className={classes.filedset}>
            <FilterDropdown
              data={options.eyes}
              placeholder="Eyes"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.eyes?.[0]}
              onSelect={(value) => modifyConfig("eyes", value ? [value] : undefined)}
            />
            <FilterDropdown
              data={options.eyebrows}
              placeholder="Brows"
              customStyles={{ ...dropdownStyles, marginTop: rem(12) }}
              selectedValue={updatedConfig.eyebrows?.[0]}
              onSelect={(value) => modifyConfig("eyebrows", value ? [value] : undefined)}
            />
          </Fieldset>
          <Fieldset legend="Nose" className={classes.filedset}>
            <FilterDropdown
              data={options.nose}
              placeholder="Nose"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.nose?.[0]}
              onSelect={(value) => modifyConfig("nose", value ? [value] : undefined)}
            />
          </Fieldset>
          <Fieldset legend="Mouth" className={classes.filedset}>
            <FilterDropdown
              data={options.mouth}
              placeholder="Mouth"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.mouth?.[0]}
              onSelect={(value) => modifyConfig("mouth", value ? [value] : undefined)}
            />
          </Fieldset>
          <Fieldset legend="Shirt" className={classes.filedset}>
            <FilterDropdown
              data={options.shirt as { label: string; value: string }[]}
              placeholder="Shirt"
              customStyles={dropdownStyles}
              selectedValue={updatedConfig.shirt?.[0]}
              allowDeselect={false}
              onSelect={(value) => modifyConfig("shirt", value ? [value] : undefined)}
            />
            <ColorInput
              flex={1}
              mt={12}
              withEyeDropper={false}
              value={`#${updatedConfig.shirtColor?.[0]}`}
              placeholder="Shirt color"
              defaultValue={`#${updatedConfig.shirtColor?.[0]}`}
              onChange={(value) => modifyConfig("shirtColor", [sanitizeValue(value)])}
            />
          </Fieldset>
          <Fieldset legend="Background" className={classes.filedset}>
            <ColorInput
              flex={1}
              withEyeDropper={false}
              value={`#${bgColorOne}`}
              placeholder="Color one"
              onChange={(value) => {
                if (!updatedConfig.backgroundColor) return;
                setBgColorOne(sanitizeValue(value));
                modifyConfig("backgroundColor", [
                  sanitizeValue(value),
                  updatedConfig.backgroundColor[0],
                ]);
              }}
            />
            <ColorInput
              mt={12}
              flex={1}
              withEyeDropper={false}
              value={`#${bgColorTwo}`}
              placeholder="Color two"
              onChange={(value) => {
                if (!updatedConfig.backgroundColor) return;
                setBgColorTwo(sanitizeValue(value));
                modifyConfig("backgroundColor", [
                  updatedConfig.backgroundColor[1],
                  sanitizeValue(value),
                ]);
              }}
            />
          </Fieldset>
        </Stack>
      </Stack>
    </Stack>
  );
}
