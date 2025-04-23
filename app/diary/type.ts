export type DiaryType = {
  _id: string | null;
  audio: { createdAt: string; url: string }[];
  part: string | null;
  concern: string | null;
  transcriptions: { createdAt: string; text: string }[];
  createdAt: string | Date;
  activity: DiaryActivityType[];
};

export type DiaryActivityType = {
  contentId: string;
  name?: string;
  url: string;
  thumbnail?: string;
  icon?: string;
  contentType: "image" | "video";
};

export enum ChatCategoryEnum {
  TASK = "task",
  PRODUCT = "product",
  DIARY = "diary",
  ANSWERS = "answers",
  ROUTINE = "routine",
  GENERAL = "general",
}
