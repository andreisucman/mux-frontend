import React, { useCallback } from "react";
import { IconHeart, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
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

  const icon =
    type === "head" ? (
      <IconMoodSmile className="icon" style={{ marginRight: rem(8) }} />
    ) : type === "body" ? (
      <IconMan className="icon" style={{ marginRight: rem(8) }} />
    ) : (
      <IconHeart className="icon" style={{ marginRight: rem(8) }} />
    );

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
    router.push(`/upload-progress?${query}`);
  }, []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Button className={classes.button} onClick={onClick}>
        {icon} {scanText}
      </Button>
    </Stack>
  );
}
