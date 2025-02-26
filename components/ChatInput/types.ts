export type RecentMessageType = {
  user: MessageContent[];
  assistant: MessageContent[];
};

export type MessageType = {
  role: string;
  content: MessageContent[];
};

export type MessageContent = {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
};
