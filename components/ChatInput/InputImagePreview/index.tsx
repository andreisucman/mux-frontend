import React, { useCallback, useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Group, Image, rem, Text } from "@mantine/core";
import classes from "./InputImagePreview.module.css";

type Props = {
  image: File;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function InputImagePreview({ image, setImages }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDeleteImage = useCallback(() => {
    try {
      setImages((prev) => prev?.filter((file) => file.name !== image.name));
    } catch (err) {
      console.error(err);
    }
  }, [image]);

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <Group className={classes.container}>
      <Group className={classes.row}>
        {imageUrl && <Image w={rem(40)} h={rem(40)} src={imageUrl} className={classes.image} />}
        <Text size="sm" lineClamp={1} className={classes.fileName}>
          {image.name}
        </Text>
      </Group>
      <ActionIcon variant="default" className={classes.button} onClick={handleDeleteImage}>
        <IconX className="icon icon__small" />
      </ActionIcon>
    </Group>
  );
}
