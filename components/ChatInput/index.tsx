import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown, IconChevronUp, IconSend } from "@tabler/icons-react";
import cn from "classnames";
import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  Group,
  Skeleton,
  Stack,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { ChatCategoryEnum } from "@/app/diary/type";
import { UserContext } from "@/context/UserContext";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import uploadToSpaces from "@/functions/uploadToSpaces";
import CoachIsTiredModalContent from "@/helpers/CoachIsTiredModalContent";
import { getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import openSubscriptionModal from "@/helpers/openSubscriptionModal";
import { SexEnum, UserDataType } from "@/types/global";
import EnergyIndicator from "../EnergyIndicator";
import ImageUploadButton from "./ImageUploadButton";
import InputImagePreview from "./InputImagePreview";
import { MessageContent, MessageType } from "./types";
import classes from "./ChatInput.module.css";

const Textarea = dynamic(() => import("@mantine/core").then((mod) => mod.Textarea), {
  ssr: false,
  loading: () => <Skeleton className="skeleton" visible></Skeleton>,
});

type Props = {
  isClub?: boolean;
  dividerLabel?: string;
  disabled?: boolean;
  defaultVisibility?: "open" | "closed";
  heading?: React.ReactNode;
  openChatKey?: string;
  userName?: string | string[];
  conversation?: MessageType[];
  chatCategory?: ChatCategoryEnum;
  chatContentId?: string;
  additionalData?: { [key: string]: any };
  autoFocus?: boolean;
  showEnergy?: boolean;
  hideDivider?: boolean;
  disableFocus?: boolean;
  conversationId?: string | null;
  starterQuestions: string[];
  onClick?: () => void;
  setIsThinking?: React.Dispatch<React.SetStateAction<boolean>>;
  setConversation?: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setConversationId?: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ChatInput({
  isClub,
  heading,
  disabled,
  defaultVisibility,
  additionalData = {},
  userName,
  dividerLabel,
  conversation,
  chatCategory,
  chatContentId,
  openChatKey,
  autoFocus,
  disableFocus,
  conversationId,
  starterQuestions,
  showEnergy,
  hideDivider,
  onClick,
  setIsThinking,
  setConversation,
  setConversationId,
}: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showStarterQuestions, setShowStarterQuestions] = useState(false);
  const [showChat, setShowChat] = useState(defaultVisibility === "open");

  const { coachEnergy, demographics } = userDetails || {};
  const { sex } = demographics || {};

  const query = searchParams.get("query");

  const handleCreateCheckoutSession = useCallback(async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchParams.toString()}`;

    createCheckoutSession({
      priceId: isClub
        ? process.env.NEXT_PUBLIC_PEEK_PRICE_ID!
        : process.env.NEXT_PUBLIC_ADVISOR_PRICE_ID!,
      redirectUrl,
      cancelUrl: redirectUrl,
      setUserDetails,
    });
  }, [isClub, pathname, searchParams.toString()]);

  const openCoachIsTiredModal = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      size: "lg",
      title: (
        <Title component={"p"} order={5}>
          Coach is resting
        </Title>
      ),
      innerProps: <CoachIsTiredModalContent sex={sex as SexEnum} value={coachEnergy || 0} />,
    });
  }, [sex, coachEnergy]);

  const handleAddSubscription = useCallback(() => {
    const { subscriptions } = userDetails || {};
    const { advisor } = subscriptions || {};
    const { isTrialUsed } = advisor || {};

    const buttonText = !!isTrialUsed ? "Add coach" : "Try free for 1 day";

    const onClick = userName
      ? handleCreateCheckoutSession
      : !!isTrialUsed
        ? handleCreateCheckoutSession
        : () =>
            startSubscriptionTrial({
              subscriptionName: "advisor",
            });

    const payload = {
      title: userName ? `Add the peek license` : `Add the advisor coach`,
      modalType: userName ? "peek" : ("advisor" as "peek"),
      isCentered: true,
      price: userName ? "12" : "8",
      buttonText,
      onClick,
      onClose: () => fetchUserData({ setUserDetails }),
      underButtonText: userName ? "" : "No credit card required",
    };

    openSubscriptionModal(payload);
  }, [userDetails, openSubscriptionModal]);

  const appendMessage = useCallback((array: MessageType[]) => {
    if (setConversation)
      setConversation((prevConversation) => {
        const newConversation = [...prevConversation.slice(0, 49), ...array];
        return newConversation;
      });

    if (query) {
      const query = modifyQuery({
        params: [{ name: "query", value: null, action: "delete" }],
      });
      router.replace(`${pathname}?${query}`);
    }
  }, []);

  const appendToLastMessage = useCallback(
    (text: string) => {
      if (!setConversation) return;
      setConversation((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const lastContent = lastMessage.content[lastMessage.content.length - 1];
        const updatedLastContent = { ...lastContent, text: lastContent.text + text };
        const updatedLastMessage = {
          ...lastMessage,
          content: [updatedLastContent],
        };
        return [...prevMessages.slice(0, -1), updatedLastMessage];
      });
    },
    [setConversation, conversation]
  );

  const sendMessage = useCallback(
    async (messages: MessageContent[]) => {
      if (!conversation || currentMessage.trim().length === 0) return;
      if (!currentMessage) return;

      try {
        const newMessages = [];

        if (images.length > 0) {
          const imageUrls = await uploadToSpaces({
            itemsArray: images,
          });

          const imageMessages = imageUrls.map((imageUrl: string) => ({
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          }));

          newMessages.push(...imageMessages);
        }

        newMessages.push({
          role: "user",
          content: messages,
        });

        setCurrentMessage("");
        appendMessage(newMessages);
        setImages([]);

        if (setIsThinking) setIsThinking(true);

        const payload: { [key: string]: any } = {
          conversationId,
          messages: newMessages,
          chatCategory,
          contentId: chatContentId,
          ...additionalData,
        };

        if (userName) payload.userName = userName;

        const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}/addMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        if (!response.ok) throw new Error(response.statusText);

        const contentTypeHeader = response.headers.get("Content-Type");
        const isJson = contentTypeHeader?.includes("application/json");

        if (response.status === 200) {
          if (setIsThinking) setIsThinking(false);

          if (isJson) {
            const data = await response.json();

            if (data.error) {
              if (setConversation) setConversation((prev) => prev.slice(0, prev.length - 1));
              if (data.error === "not following") {
                openErrorModal({
                  description: "Follow this user before asking questions about them.",
                });
              } else if (data.error === "subscription expired") {
                handleAddSubscription();
              } else if (data.error === "coach is tired") {
                openCoachIsTiredModal();
              } else {
                openErrorModal({ description: data.error });
              }
              if (setIsThinking) setIsThinking(false);
              return;
            }
          } else {
            const reader = response.body?.getReader();

            if (!reader) throw new Error("No reader");

            appendMessage([{ role: "assistant", content: [{ type: "text", text: "" }] }]);

            const decoder = new TextDecoder();
            let done = false;
            let text = "";

            // Read the stream as it's received
            while (!done) {
              const { value, done: doneReading } = await reader.read();
              done = doneReading;
              const decodedValue = decoder.decode(value, { stream: true });
              const chunks = decodedValue.split("<-c->").filter((c) => c.trim());

              for (const chunk of chunks) {
                const parsedChunk = JSON.parse(chunk);
                const { data, coachEnergy, conversationId } = parsedChunk;
                if (data) appendToLastMessage(data);

                if (coachEnergy) {
                  setUserDetails((prev: UserDataType) => ({
                    ...prev,
                    coachEnergy,
                  }));
                }

                if (conversationId) {
                  const key = chatContentId || chatCategory;
                  if (key) {
                    if (setConversationId) setConversationId(conversationId);
                    saveToIndexedDb(`conversationId-${key}`, conversationId);
                  }
                }

                text += data;
              }
            }
          }
        }
      } catch (err: any) {
        console.log("Error in sendMessage: ", err);
        if (setConversation) setConversation((prev) => prev.slice(0, prev.length - 1));
      } finally {
        if (setIsThinking) setIsThinking(false);
      }
    },
    [
      currentMessage,
      images,
      additionalData,
      chatContentId,
      conversationId,
      conversation && conversation.length,
    ]
  );

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      if (disabled) return;
      sendMessage([{ type: "text", text: currentMessage }]);
    },
    [disabled, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const previewImages = useMemo(
    () =>
      images.map((image, index) => (
        <InputImagePreview key={index} image={image} setImages={setImages} />
      )),
    [images.length]
  );

  const finalDividerLabel = useMemo(
    () => (
      <Group style={{ cursor: "pointer" }}>
        {showChat ? <IconChevronDown className="icon" /> : <IconChevronUp className="icon" />}
        {dividerLabel ? dividerLabel : showChat ? "Hide chat" : "Open chat"}
      </Group>
    ),
    [showChat, dividerLabel]
  );

  const handleToggleChat = () => {
    setShowChat((prev) => {
      if (openChatKey) saveToIndexedDb(`openInputChat-${openChatKey}`, !prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (!query) return;
    setCurrentMessage(query as string);
  }, [query]);

  useEffect(() => {
    getFromIndexedDb(`openInputChat-${openChatKey}`).then((verdict) => {
      if (openChatKey) {
        setShowChat(verdict || defaultVisibility === "open");
      }
    });
  }, [chatContentId]);

  useEffect(() => {
    if (!conversation) return;
    if (starterQuestions.length === 0) return;

    const showStarterQuestions =
      starterQuestions.length > 0 && conversation && conversation.length === 0;

    let tId: any;

    if (!showStarterQuestions) {
      setShowStarterQuestions(false);
    } else {
      tId = setTimeout(() => {
        setShowStarterQuestions(!!showStarterQuestions);
        clearTimeout(tId);
      }, 2000);
    }

    return () => {
      if (tId) clearTimeout(tId);
    };
  }, [conversation && conversation.length === 0]);

  const starterButtons = starterQuestions.map((q) => (
    <Button variant="default" key={q} size="compact-sm" onClick={() => setCurrentMessage(q)}>
      {q}
    </Button>
  ));

  return (
    <Stack className={classes.container}>
      {!hideDivider && <Divider label={finalDividerLabel} onClick={handleToggleChat} />}
      {showStarterQuestions && images.length === 0 && (
        <Group className={classes.starterQuestions}>
          <Group className={classes.starterQuestionsWrapper}>{starterButtons}</Group>
        </Group>
      )}
      <Collapse in={showChat}>
        <Stack className={classes.container}>
          {heading}
          <form className={classes.enter} onSubmit={handleSubmit}>
            <Group className={classes.inputGroup} onClick={onClick}>
              <Group className={classes.uploadRow}>{previewImages}</Group>
              <Textarea
                value={currentMessage}
                className={cn(classes.input, { [classes.disableInput]: disableFocus })}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                minRows={1}
                maxRows={4}
                size="md"
                tabIndex={disableFocus ? -1 : 0}
                placeholder="Type your message"
                data-autofocus={!disableFocus && autoFocus}
                rightSection={
                  <ImageUploadButton
                    disabled={(images && images?.length >= 2) || false}
                    setImages={setImages}
                    uploadButtonId={`${chatCategory}-${chatContentId}`}
                  />
                }
                autosize
              />

              <ActionIcon
                type={"submit"}
                variant="default"
                disabled={disabled}
                className={classes.submit}
              >
                <IconSend className="icon" />
              </ActionIcon>
            </Group>
          </form>
          {showEnergy && <EnergyIndicator value={coachEnergy || 0} />}
        </Stack>
      </Collapse>
    </Stack>
  );
}
