export type DiaryRecordType = {
  _id: string | null;
  type: string;
  audio: string | null;
  transcription: string | null;
  createdAt: string | Date;
  activity: DiaryActivityType[];
};

export type DiaryActivityType = {
  name?: string;
  url: string;
  thumbnail?: string;
  icon?: string;
  type: "image" | "video";
};
