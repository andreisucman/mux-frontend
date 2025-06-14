import React, { useState } from "react";
import { Button, rem, Stack, Text } from "@mantine/core";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import TextareaComponent from "@/components/TextAreaComponent";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import pantryImage from "@/public/assets/pantry.svg";
import classes from "./RecipeSettingsContent.module.css";

type Props = {
  onSubmit: (constraints?: string, productsImage?: string) => void;
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
      setImage(imageUrls?.[0]);
      setIsLoadingOverlay(false);
    } catch (err) {
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
      <Text size="sm" c="dimmed" ta="center">
        Specify your constraints
      </Text>
      <TextareaComponent
        text={constraints}
        placeholder={"Example: I only have potatoes, olive oil, onions, a pan and gas stove."}
        setText={setConstraints}
        editable
      />
      <Text size="sm" c="dimmed" ta="center">
        or take a photo of your products
      </Text>
      <Stack>
        <Stack className={classes.imageComponentWrapper}>
          <ImageDisplayContainer
            image={image}
            isLoadingOverlay={isLoadingOverlay}
            handleDelete={handleDelete}
            placeholder={pantryImage}
            customImageStyles={{
              position: "static",
              maxHeight: rem(300),
              height: "100%",
            }}
          />
          {!image && (
            <Button
              component="label"
              htmlFor="upload_products_photo"
              variant={"default"}
              className={classes.imageButton}
              disabled={isLoading}
            >
              Upload products
              <input
                hidden
                id="upload_products_photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          )}
        </Stack>
      </Stack>
      <Button loading={isLoading} disabled={isLoading || isLoadingOverlay} onClick={handleGenerate}>
        Generate recipe
      </Button>
    </Stack>
  );
}
