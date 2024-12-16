"use client";

import React, { useRef, useState } from "react";
import { MessageType } from "../../types";
import ChatDisplay from "../ChatDisplay";
import ChatInput from "../ChatInput";
import classes from "./ChatBody.module.css";

type Props = {
  userName?: string | string[];
};

const ChatBody = ({ userName }: Props) => {
  const chatRef = useRef<HTMLScriptElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  return (
    <section className={classes.container} ref={chatRef}>
      <div className={classes.wrapper}>
        <ChatDisplay
          isTyping={isTyping}
          conversation={conversation}
          setConversation={setConversation}
        />
        <ChatInput
          conversation={conversation}
          setConversation={setConversation}
          setIsTyping={setIsTyping}
          userName={userName}
          defaultOpen
        />
      </div>
    </section>
  );
};

export default ChatBody;
