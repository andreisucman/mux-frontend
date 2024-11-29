export type CoachQuestionType = {
  icon: string;
  question: string;
  color: string;
  onClick?: () => void;
};

export type MessageType = {
  role: string;
  content: MessageContent[];
};

export type MessageContent = {
  type: "text" | "image_url";
  text?: string;
  image_url?: string;
};
