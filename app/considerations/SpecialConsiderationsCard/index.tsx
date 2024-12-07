import React from "react";
import { rem, Stack, Textarea } from "@mantine/core";
import classes from "./SpecialConsiderationsCard.module.css";

type Props = {
  placeholder: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export default function SpecialConsiderationsCard({ placeholder, setText }: Props) {
  return (
    <Stack flex={1}>
      <Textarea
        placeholder={placeholder}
        minRows={2}
        maxRows={8}
        mih={rem(200)}
        mah={rem(300)}
        h="100%"
        flex={1}
        onChange={(e) => setText(e.target.value)}
        classNames={{ wrapper: classes.wrapper, root: classes.root, input: classes.input }}
      />
    </Stack>
  );
}
