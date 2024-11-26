import React, { useState } from "react";
import { IconCamera, IconToolsKitchen2 } from "@tabler/icons-react";
import { Button, rem, Stack, Text } from "@mantine/core";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import TextareaComponent from "@/components/TextAreaComponent";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import classes from "./RecipeSettingsContent.module.css";

type Props = {
  onSubmit: (constraints?: string, productsImage?: string) => Promise<void>;
};

export default function RecipeSettingsContent({ onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [constraints, setConstraints] = useState("");
  const [image, setImage] = useState("");
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    try {
      setIsLoadingOverlay(true);
      const imageUrls = await uploadToSpaces({ itemsArray: [file] });
      setImage(imageUrls[0]);
      setIsLoadingOverlay(false);
    } catch (err) {
      console.log("Error in handleFileChange: ", err);
      setIsLoadingOverlay(false);
    }
  };

  const handleDelete = () => {
    setImage("");
    deleteFromLocalStorage("productsImage");
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await onSubmit(constraints, image);
    setIsLoading(false);
  };

  return (
    <Stack>
      <TextareaComponent
        text={constraints}
        heading={
          <Text size="xs" c="dimmed">
            Constraints (optional):
          </Text>
        }
        placeholder={"Example: I only have potatoes, oil, onions, a pan and gas stove."}
        setText={setConstraints}
        editable
      />
      <Text size="sm" c="dimmed" ta="center">
        or upload a photo of your products...
      </Text>
      <Stack>
        <Stack className={classes.imageComponentWrapper}>
          <ImageDisplayContainer
            image={image}
            isLoadingOverlay={isLoadingOverlay}
            customImageStyles={{ height: "unset", maxHeight: rem(110) }}
            handleDelete={handleDelete}
          />
          <Button
            component="label"
            htmlFor="upload_products_photo"
            variant={"default"}
            className={classes.imageButton}
          >
            <IconCamera className="icon" style={{ marginRight: rem(8) }} /> Upload photo
            <input
              hidden
              id="upload_products_photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Stack>
      </Stack>
      <Button loading={isLoading} disabled={isLoading} onClick={handleGenerate}>
        <IconToolsKitchen2 className="icon" style={{ marginRight: rem(8) }} /> Generate recipe
      </Button>
    </Stack>
  );
}
