"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Stack } from "@mantine/core";
import { MessageContent } from "../ChatInput/types";
import classes from "./Message.module.css";

const Markdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

type props = {
  message: MessageContent;
  role: string;
  divRef?: React.RefObject<HTMLDivElement>;
};

const renderImageMessage = (message: MessageContent) => (
  <Stack className={classes.imageWrapper}>
    <Image
      src={message.image_url?.url || "/"}
      alt=""
      width={150}
      height={150}
      style={{ objectFit: "contain" }}
    />
  </Stack>
);

const renderTextMessage = (message: MessageContent) => {
  return (
    <span className={classes.markdownWrapper}>
      <Markdown>{message.text}</Markdown>
    </span>
  );
};

const Message: React.FC<props> = ({ divRef, message, role }) => {
  return (
    <div
      className={
        role === "assistant" ? `${classes.container} ${classes.container__bot}` : classes.container
      }
      ref={divRef}
    >
      <div className={classes.text}>
        {role === "assistant" ? (
          <span className={classes.label}>Coach</span>
        ) : (
          <span className={classes.label}>You</span>
        )}
        {message.type === "text" ? renderTextMessage(message) : renderImageMessage(message)}
      </div>
    </div>
  );
};

export default Message;
