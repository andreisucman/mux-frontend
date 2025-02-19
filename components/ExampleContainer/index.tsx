"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton, Stack, Text } from "@mantine/core";
import classes from "./ExampleContainer.module.css";

type Props = {
  title?: string;
  type: string;
  url: string;
  customStyles?: { [key: string]: any };
  customClass?: string;
};

export default function ExampleContainer({ title, type, url, customClass, customStyles }: Props) {
  const [isReady, setIsReady] = useState(false);

  return (
    <Stack
      className={customClass ? `${classes.container} ${classes[customClass]}` : classes.container}
      style={customStyles || {}}
    >
      {title && (
        <Text c="dimmed" className={classes.title}>
          {title}
        </Text>
      )}
      <Skeleton visible={!isReady} className={classes.exampleContainer} style={{ borderRadius: 0 }}>
        {type === "video" ? (
          <iframe
            width="560"
            height="315"
            src={url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className={classes.iframe}
            onLoad={() => setIsReady(true)}
          ></iframe>
        ) : (
          <Image
            className={classes.exampleImage}
            src={url}
            width={100}
            height={100}
            alt=""
            unoptimized
            onLoad={() => setIsReady(true)}
          />
        )}
      </Skeleton>
    </Stack>
  );
}
