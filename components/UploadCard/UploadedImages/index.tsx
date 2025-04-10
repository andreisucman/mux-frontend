import React from "react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ActionIcon, Group, Image, Stack } from "@mantine/core";
import classes from "./UploadedImages.module.css";

type Props = {
  images: string[];
  onClick: (imageUrl: string) => void;
  handleRemove: (imageUrl: string) => void;
  handleAddMore: () => void;
};
export default function UploadedImages({ images, onClick, handleRemove, handleAddMore }: Props) {
  return (
    <Group className={`scrollbar ${classes.container} `}>
      {images.map((image) => (
        <Stack className={classes.imageWrapper} key={image}>
          <ActionIcon size="xs" className={classes.close} onClick={() => handleRemove(image)}>
            <IconX className="icon" />
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
      {images.length < 4 && (
        <div className={classes.addButton} onClick={handleAddMore}>
          <IconPlus className={"icon icon__large"} />
        </div>
      )}
    </Group>
  );
}
