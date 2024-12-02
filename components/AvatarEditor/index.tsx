import React, { useMemo, useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import Avatar, { AvatarConfig, genConfig } from "react-nice-avatar";
import { Button, ColorInput, Group, Stack } from "@mantine/core";
import { UpdateClubInfoProps } from "@/app/settings/page";
import FilterDropdown from "../FilterDropdown";
import { options } from "./options";
import classes from "./AvatarEditor.module.css";

type Props = {
  currentConfig: AvatarConfig;
  handleUpdateClubInfo: (updatedAvatar: UpdateClubInfoProps) => void;
};

export default function AvatarEditor({ currentConfig, handleUpdateClubInfo }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAvatar, setUpdatedAvatar] = useState<AvatarConfig>(currentConfig);

  const isDirty = useMemo(() => {
    return JSON.stringify(currentConfig) !== JSON.stringify(updatedAvatar);
  }, [updatedAvatar]);

  const modifyConfig = (key: string, value: string | null | undefined) => {
    if (!value) return;

    const updatedAvatar = genConfig({
      ...currentConfig,
      ...{ [key]: value },
    });

    setUpdatedAvatar(updatedAvatar);
  };

  return (
    <Stack className={classes.container}>
      <Avatar {...updatedAvatar} className={classes.avatar} />
      <Stack className={classes.wrapper}>
        <Button
          loading={isLoading}
          disabled={!isDirty || isLoading}
          onClick={() =>
            handleUpdateClubInfo({ type: "avatar", data: updatedAvatar, setIsLoading })
          }
        >
          <IconDeviceFloppy className={`${classes.icon} icon`} /> Save
        </Button>
        <Group className={classes.row}>
          <FilterDropdown
            data={options.hatStyle}
            placeholder="Hat"
            onSelect={(value) => modifyConfig("hatStyle", value)}
          />
          <ColorInput
            value={updatedAvatar.hatColor}
            placeholder="Hat color"
            onChange={(value) => modifyConfig("hatColor", value)}
          />
        </Group>
        <Group className={classes.row}>
          <FilterDropdown
            data={options.hairStyle as { label: string; value: string }[]}
            placeholder="Hair"
            onSelect={(value) => modifyConfig("hairStyle", value)}
          />
          <ColorInput
            value={updatedAvatar.hairColor}
            placeholder="Hair color"
            onChange={(value) => modifyConfig("hairColor", value)}
          />
        </Group>
        <FilterDropdown
          data={options.earSize}
          placeholder="Ear"
          onSelect={(value) => modifyConfig("earSize", value)}
        />
        <FilterDropdown
          data={options.eyeBrowStyle}
          placeholder="Brows"
          onSelect={(value) => modifyConfig("eyeBrowStyle", value)}
        />
        <FilterDropdown
          data={options.eyeStyle}
          placeholder="Eyes"
          onSelect={(value) => modifyConfig("eyeStyle", value)}
        />
        <FilterDropdown
          data={options.glassesStyle}
          placeholder="Glasses"
          onSelect={(value) => modifyConfig("glassesStyle", value)}
        />
        <FilterDropdown
          data={options.noseStyle}
          placeholder="Nose"
          onSelect={(value) => modifyConfig("noseStyle", value)}
        />
        <FilterDropdown
          data={options.mouthStyle}
          placeholder="Mouth"
          onSelect={(value) => modifyConfig("mouthStyle", value)}
        />
        <Group className={classes.row}>
          <FilterDropdown
            data={options.shirtStyle as { label: string; value: string }[]}
            placeholder="Shirt"
            onSelect={(value) => modifyConfig("shirtStyle", value)}
          />
          <ColorInput
            value={updatedAvatar.shirtColor}
            placeholder="Shirt color"
            onChange={(value) => modifyConfig("shirtColor", value)}
          />
        </Group>
        <ColorInput
          value={updatedAvatar.bgColor}
          placeholder="Background color"
          onChange={(value) => modifyConfig("bgColor", value)}
        />
      </Stack>
    </Stack>
  );
}
