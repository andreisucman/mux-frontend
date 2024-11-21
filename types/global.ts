export type DefaultUserType = {
  timeZone: string;
  fingerprint: number;
  tosAccepted: boolean;
  specialConsiderations: string;
  demographics: { sex: SexEnum } | null;
};

export type HeadValuePartsBoolean = {
  name: string;
  value: boolean;
  parts: { name: string; value: boolean }[];
}[];

export type ClubDataType = {
  trackedUserId: string;
  name: string;
  avatar: { [key: string]: any };
  isActive: boolean;
  bio: {
    intro: string;
    philosophy: string;
    style: string;
    tips: string;
    about: string;
    questions: { asking: string; question: string }[];
  };
  payouts: {
    connectId: string;
    rewardEarned: number;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  privacy: HeadValuePartsBoolean;
};

export type ClubUserType = {
  // if the user joined the club all of these fields must be populated with default empty values else the whole field is null
  _id: string;
  avatar: { [key: string]: any };
  name: string;
  bio: {
    intro: string;
    philosophy: string;
    style: string;
    tips: string;
    about: string;
    questions: { asking: string; question: string }[];
  };
  scores: {
    headCurrentScore: number;
    headTotalProgress: number;
    bodyCurrentScore: number;
    bodyTotalProgress: number;
  };
};

export interface UserDataType extends DefaultUserType {
  email: string | null;
  club: ClubDataType | null;
}

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}
