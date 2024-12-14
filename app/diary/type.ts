import { CompletedTaskType } from "../tasks/history/type";

export type DiaryRecordType = {
  _id: string;
  audio: string;
  text: string;
  createdAt: string;
  tasks: CompletedTaskType[];
};
