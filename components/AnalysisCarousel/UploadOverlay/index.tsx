import React from "react";
import { Button, Stack, Text } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import classes from "./UploadOverlay.module.css";

type Props = {
  text: string;
  buttonText: string;
  customStyles?: { [key: string]: any };
};

export default function UploadOverlay({ buttonText, text, customStyles }: Props) {
  const router = useRouter();

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Stack className={classes.wrapper}>
        {text && (
          <Text size="sm" ta="center">
            {text}
          </Text>
        )}
        <Button className={classes.button} onClick={() => router.push("/scan/progress")}>
          {buttonText}
        </Button>
      </Stack>
    </Stack>
  );
}
