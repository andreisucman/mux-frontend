import React, { useCallback, useEffect, useState } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import TextareaComponent from "@/components/TextAreaComponent";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";

type Props = {
  taskKey: string;
  findProducts: (taskKey: string, criteria: string) => void;
};

export default function ProductsCriteriaContainer({ taskKey, findProducts }: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    const savedProductCriteria: string | null = getFromLocalStorage("productCriteria");
    if (savedProductCriteria) setText(savedProductCriteria);
  }, []);

  const handleFindProducts = useCallback((taskKey: string, text: string) => {
    try {
      findProducts(taskKey, text);
      saveToLocalStorage("productCriteria", text);
      modals.closeAll();
    } catch (err) {
      openErrorModal();
    }
  }, []);

  return (
    <Stack flex={1}>
      <TextareaComponent
        text={text}
        placeholder={"Example: It must be cheaper and without fragrance"}
        setText={setText}
        editable
      />
      <Button variant="default" onClick={() => handleFindProducts(taskKey, text)}>
        Compare and choose best
      </Button>
    </Stack>
  );
}
