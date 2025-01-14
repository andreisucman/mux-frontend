import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown, IconChevronUp, IconSend } from "@tabler/icons-react";
import { ActionIcon, Collapse, Divider, Group, Skeleton, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import createCheckoutSession from "@/functions/createCheckoutSession";
import fetchUserData from "@/functions/fetchUserData";
import startSubscriptionTrial from "@/functions/startSubscriptionTrial";
import uploadToSpaces from "@/functions/uploadToSpaces";
import CoachIsTiredModalContent from "@/helpers/CoachIsTiredModalContent";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
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
  userName?: string | string[];
  conversation: MessageType[];
  chatCategory?: string;
  chatContentId?: string;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setConversation: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

export default function ChatInput({
  isClub,
  heading,
  disabled,
  defaultVisibility,
  userName,
  dividerLabel,
  conversation,
  chatCategory,
  chatContentId,
  setIsTyping,
  setConversation,
}: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentMessage, setCurrentMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showChat, setShowChat] = useState(defaultVisibility === "open");

  const { coachEnergy, demographics } = userDetails || {};
  const { sex } = demographics || {};

  const conversationId = searchParams.get("conversationId");
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
      modal: "subscription",
      centered: true,
      title: "Coach is resting",
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
      price: userName ? "19" : "9",
      buttonText,
      onClick,
      onClose: () => fetchUserData({ setUserDetails }),
      underButtonText: userName ? "" : "No credit card required",
    };

    openSubscriptionModal(payload);
  }, [userDetails, openSubscriptionModal]);

  const appendMessage = useCallback((array: MessageType[]) => {
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

        setIsTyping(true);

        const payload: { [key: string]: any } = {
          conversationId,
          messages: newMessages,
          chatCategory,
          chatContentId,
        };

        if (userName) payload.userName = userName;

        const response = await callTheServer({
          endpoint: "addMessage",
          method: "POST",
          server: "chat",
          body: payload,
        });

        if (response.status === 200) {
          if (response.error) {
            setConversation((prev) => prev.slice(0, prev.length - 1));
            if (response.error === "not following") {
              openErrorModal({
                description: "Follow this user before asking questions about them.",
              });
            } else if (response.error === "subscription expired") {
              handleAddSubscription();
            } else if (response.error === "coach is tired") {
              openCoachIsTiredModal();
            } else {
              openErrorModal({ description: response.error });
            }
            setIsTyping(false);
            return;
          }

          const { conversationId, reply } = response.message || {};

          if (conversationId) {
            const newQuery = modifyQuery({
              params: [
                {
                  name: "conversationId",
                  value: conversationId,
                  action: "replace",
                },
              ],
            });
            router.replace(`${pathname}?${newQuery}`);
          }

          appendMessage([
            {
              role: "assistant",
              content: [{ type: "text", text: reply || "" }],
            },
          ]);
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            coachEnergy: response.message?.coachEnergy,
          }));
        }
      } catch (err: any) {
        setConversation((prev) => prev.slice(0, prev.length - 1));
      } finally {
        setIsTyping(false);
      }
    },
    [currentMessage, images, conversation && conversation.length]
  );

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      if (disabled) return;
      sendMessage([{ type: "text", text: currentMessage }]);
    },
    [disabled, currentMessage, images]
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
      if (defaultVisibility !== "closed")
        saveToLocalStorage("openInputChat", { [chatCategory || "general"]: !prev }, "add");

      return !prev;
    });
  };

  useEffect(() => {
    if (!query) return;
    setCurrentMessage(query as string);
  }, [query]);

  useEffect(() => {
    const savedInputChatOpens: { [key: string]: boolean } | null =
      getFromLocalStorage("openInputChat");

    if (savedInputChatOpens) {
      const relatedVerdict = savedInputChatOpens[chatCategory || "general"];
      setShowChat(relatedVerdict);
    }
  }, []);

  return (
    <Stack className={classes.container}>
      <Divider label={finalDividerLabel} onClick={handleToggleChat} />
      <Collapse in={showChat}>
        <Stack className={classes.container}>
          {heading}
          <form className={classes.enter} onSubmit={handleSubmit}>
            <Group className={classes.inputGroup}>
              <Group className={classes.uploadRow}>{previewImages}</Group>
              <Textarea
                value={currentMessage}
                className={classes.input}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                minRows={1}
                maxRows={4}
                size="md"
                placeholder="Type your message"
                autosize
                rightSection={
                  <ImageUploadButton
                    disabled={(images && images?.length >= 2) || false}
                    setImages={setImages}
                  />
                }
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
          <EnergyIndicator value={coachEnergy || 0} />
        </Stack>
      </Collapse>
    </Stack>
  );
}
