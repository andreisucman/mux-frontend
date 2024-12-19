import React from "react";
import dynamic from "next/dynamic";
import { LoadingOverlay, rem, Skeleton, Stack } from "@mantine/core";
import classes from "./TextAreaComponent.module.css";

type Props = {
  text?: string;
  heading?: React.ReactNode;
  isUnbounded?: boolean;
  readOnly?: boolean;
  editable?: boolean;
  isLoading?: boolean;
  placeholder: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const Textarea = dynamic(() => import("@mantine/core").then((mod) => mod.Textarea), {
  ssr: false,
  loading: () => <Skeleton mih={78} className="skeleton" visible></Skeleton>,
});

export default function TextareaComponent({
  text,
  heading,
  isLoading,
  readOnly,
  isUnbounded,
  editable = true,
  placeholder,
  setText,
}: Props) {
  return (
    <Stack className={classes.container}>
      {heading}
      <Stack className={`${classes.wrapper} scrollbar`}>
        <LoadingOverlay visible={isLoading} className={classes.loadingOverlay} />
        <Textarea
          placeholder={placeholder}
          readOnly={readOnly}
          minRows={2}
          flex={1}
          h={isUnbounded ? undefined : rem(150)}
          value={text}
          disabled={!editable}
          onChange={(e) => setText(e.target.value)}
          classNames={{
            wrapper: classes.areaWrapper,
            root: classes.areaRoot,
            input: classes.areaInput,
          }}
        />
      </Stack>
    </Stack>
  );
}
