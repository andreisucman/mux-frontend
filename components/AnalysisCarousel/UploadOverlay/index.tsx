import React, { useCallback } from "react";
import { Button, Stack } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import modifyQuery from "@/helpers/modifyQuery";
import { TypeEnum } from "@/types/global";
import classes from "./UploadOverlay.module.css";

type Props = {
  type: TypeEnum;
  customStyles?: { [key: string]: any };
};

export default function UploadOverlay({ type, customStyles }: Props) {
  const router = useRouter();
  const finalType = type === "head" ? type : "body";

  const scanText = type === "head" ? "Scan head" : "Scan body";

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
      <Button className={classes.button} onClick={onClick}>
        {scanText}
      </Button>
    </Stack>
  );
}
