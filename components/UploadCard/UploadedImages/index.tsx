import React from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Image, Stack } from "@mantine/core";
import classes from "./UploadedImages.module.css";

type Props = {
  images: string[];
  onClick: (imageUrl: string) => void;
  handleRemove: (imageUrl: string) => void;
  handleAddMore: () => void;
  maxLength: number;
};
export default function UploadedImages({
  images,
  maxLength,
  onClick,
  handleRemove,
  handleAddMore,
}: Props) {
  const showAdd = images.length < 3 && images.length < maxLength;

  return (
    <Group className={cn("scrollbar", classes.container)}>
      {images.map((image) => (
        <Stack className={classes.imageWrapper} key={image}>
          <ActionIcon size="xs" className={classes.close} onClick={() => handleRemove(image)}>
            <IconX size={20} />
          </ActionIcon>
          <Image
            src={image}
            width={50}
            height={50}
            className={classes.image}
            onClick={() => onClick(image)}
          />
        </Stack>
      ))}
      {showAdd && (
        <div className={classes.addButton} onClick={handleAddMore}>
          <IconPlus size={24} />
        </div>
      )}
    </Group>
  );
}
