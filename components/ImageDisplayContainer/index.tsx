import React from "react";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Image, LoadingOverlay, rem, Stack } from "@mantine/core";
import classes from "./ImageDisplayContainer.module.css";

type Props = {
  isLoadingOverlay?: boolean;
  image?: string;
  handleDelete?: () => void;
  placeholder: any;
  customImageStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
};

export default function ImageDisplayContainer({
  image,
  isLoadingOverlay = false,
  customImageStyles,
  customStyles,
  placeholder,
  handleDelete,
}: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      {handleDelete && image && (
        <ActionIcon className={classes.deleteIcon} variant="default" onClick={handleDelete}>
          <IconTrash style={{ width: rem(16) }} />
        </ActionIcon>
      )}
      <Image
        width={100}
        height={100}
        src={image || placeholder.src || "https://placehold.co/169x300?text=Your+photo"}
        className={classes.image}
        style={customImageStyles ? customImageStyles : {}}
        alt=""
      />
      <LoadingOverlay visible={isLoadingOverlay} overlayProps={{ radius: 16, blur: 2 }} />
    </Stack>
  );
}
