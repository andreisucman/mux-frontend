"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton, Stack, Text } from "@mantine/core";
import classes from "./ExampleContainer.module.css";

type Props = {
  title?: string;
  example?: { type: string; url: string };
};

export default function ExampleContainer({ title, example }: Props) {
  const [isReady, setIsReady] = useState(false);

  return (
    <Stack className={classes.container}>
      {title && (
        <Text c="dimmed" className={classes.title}>
          {title}
        </Text>
      )}
      <Skeleton visible={!isReady} className={classes.exampleContainer} style={{ borderRadius: 0 }}>
        {example && example.type === "video" ? (
          <iframe
            width="560"
            height="315"
            src={example.url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className={classes.iframe}
            onLoad={() => setIsReady(true)}
          ></iframe>
        ) : (
          <>
            {example && (
              <Image
                className={classes.exampleImage}
                src={example.url}
                width={100}
                height={100}
                alt=""
                onLoad={() => setIsReady(true)}
              />
            )}
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
