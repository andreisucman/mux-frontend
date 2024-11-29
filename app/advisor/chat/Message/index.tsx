import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Stack } from "@mantine/core";
import { MessageContent } from "../../types";
import classes from "./Message.module.css";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

type props = {
  message: MessageContent;
  role: string;
  divRef?: React.RefObject<HTMLDivElement>;
};

const textMessage = (message: MessageContent) => (
  <span className={classes.markdownWrapper}>
    <Markdown>{message.text}</Markdown>
  </span>
);

const imageMessage = (message: MessageContent) => (
  <Stack className={classes.imageWrapper}>
    <Image
      src={message.image_url!}
      alt=""
      width={200}
      height={200}
      style={{ objectFit: "contain" }}
    />
  </Stack>
);

const Message: React.FC<props> = ({ message, role, divRef }) => {
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
        {message.type === "text" ? textMessage(message) : imageMessage(message)}
      </div>
    </div>
  );
};

export default Message;
