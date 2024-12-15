export type DiaryTaskType = {
  _id: string;
  name: string;
  icon: string;
  color: string;
};

export type DiaryRecordType = {
  _id: string | null;
  type: string;
  audio: string | null;
  transcription: string | null;
  createdAt: string | Date;
  tasks: DiaryTaskType[];
};
