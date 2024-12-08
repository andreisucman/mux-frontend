"use client";

import React, { useRef, useState } from "react";
import { MessageType } from "../../types";
import ChatDisplay from "../ChatDisplay";
import ChatInput from "../ChatInput";
import classes from "./ChatBody.module.css";

const ChatBody = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const chatRef = useRef<HTMLScriptElement>(null);

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
          defaultOpen={true}
        />
      </div>
    </section>
  );
};

export default ChatBody;
