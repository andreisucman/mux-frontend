export type DiaryRecordType = {
  _id: string | null;
  audio: string | null;
  part: string | null;
  transcription: string | null;
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
  categoryName: "proof" | "food";
};

export enum ChatCategoryEnum {
  TASK = "task",
  PRODUCT = "product",
  DIARY = "diary",
  ANSWERS = "answers",
  FOOD = "food",
  ROUTINE = "routine",
  GENERAL = "general",
}
