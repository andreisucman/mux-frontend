"use client";

import React, { useContext, useRef, useState } from "react";
import { IconBatteryVertical, IconBatteryVertical4 } from "@tabler/icons-react";
import { UserContext } from "@/context/UserContext";
import { MessageType } from "../../types";
import ChatDisplay from "../ChatDisplay";
import ChatInput from "../ChatInput";
import classes from "./ChatBody.module.css";

const ChatBody = () => {
  const { userDetails } = useContext(UserContext);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);
  const chatRef = useRef<HTMLScriptElement>(null);

  const { coachEnergy } = userDetails || {};
  const coachIcon =
    coachEnergy && coachEnergy < 50000 ? (
      <IconBatteryVertical4 className="icon" />
    ) : (
      <IconBatteryVertical className="icon" />
    );

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
        />
      </div>
    </section>
  );
};

export default ChatBody;
