import { BlurredUrlType } from "@/types/global";

export type SimpleStyleType = {
  _id: string;
  userId: string;
  styleIcon: string;
  compareIcon: string;
  isPublic: boolean;
  mainUrl: BlurredUrlType;
  compareMainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
  styleName: string;
  compareName: string;
  analysis: { [key: string]: number };
  compareAnalysis: { [key: string]: number };
  votes: number;
  compareVotes: number;
  createdAt: string;
  compareDate: string;
};
