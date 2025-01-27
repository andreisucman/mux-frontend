import React, { useCallback } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import modifyQuery from "@/helpers/modifyQuery";
import { TypeEnum } from "@/types/global";
import classes from "./UploadOverlay.module.css";

type Props = {
  type: TypeEnum;
  text: string;
  buttonText: string;
  customStyles?: { [key: string]: any };
};

export default function UploadOverlay({ type, buttonText, text, customStyles }: Props) {
  const router = useRouter();
  const finalType = type === "head" ? type : "body";

  const onClick = useCallback(() => {
    const query = modifyQuery({
      params: [
        {
          name: "type",
          value: finalType,
          action: "replace",
        },
      ],
    });
    router.push(`/scan/progress?${query}`);
  }, []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Stack className={classes.wrapper}>
        {text && (
          <Text size="sm" ta="center">
            {text}
          </Text>
        )}
        <Button className={classes.button} onClick={onClick}>
          {buttonText}
        </Button>
      </Stack>
    </Stack>
  );
}
