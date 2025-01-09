export type DiaryRecordType = {
  _id: string | null;
  type: string;
  audio: string | null;
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
  categoryName: "style" | "proof" | "food";
};
