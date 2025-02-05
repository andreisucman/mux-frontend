import React, { useCallback } from "react";
import { IconPhoto } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

type Props = {
  uploadButtonId: string;
  disabled: boolean;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function ImageUploadButton({ uploadButtonId, disabled, setImages }: Props) {
  const handleUploadFile = useCallback((e: any) => {
    const files: File[] = e.target.files;

    if (files && files.length > 0) {
      const validTypes = ["image/png", "image/jpeg"];
      const filteredFiles = Array.from(files).filter((file) => validTypes.includes(file.type));

      if (filteredFiles.length > 0) {
        setImages((prev: File[]) => [...prev, ...filteredFiles]);
      }
    }
  }, []);

  return (
    <ActionIcon
      component="label"
      htmlFor={uploadButtonId}
      disabled={disabled}
      variant="default"
      style={{ border: "none" }}
    >
      <IconPhoto className="icon" />
      <input
        hidden
        disabled={disabled}
        id={uploadButtonId}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleUploadFile}
      />
    </ActionIcon>
  );
}
