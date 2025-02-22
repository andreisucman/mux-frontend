import { RequirementType } from "@/components/UploadContainer/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";

export type DefaultUserType = {
  timeZone: string;
  tosAccepted: boolean;
  specialConsiderations: string;
};

export type HeadValuePartsBoolean = {
  name: string;
  value: boolean;
  parts: { name: string; value: boolean }[];
}[];

type ClubBioType = {
  intro: string;
  philosophy: string;
  tips: string;
  socials: { value: string; label: string }[];
  nextRegenerateBio: {
    philosophy: string | null;
    tips: string | null;
  };
};

export type ClubDataType = {
  followingUserId: string;
  followingUserName: string;
  bio: ClubBioType;
  payouts: {
    connectId: string;
    balance: number;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    disabledReason: string;
  };
  privacy: HeadValuePartsBoolean;
  nextAvatarUpdateAt: Date | null;
  nextNameUpdateAt: Date | null;
  totalFollowers: number;
};

export type ClubUserType = {
  // if the user joined the club all of these fields must be populated with default empty values else the whole field is null
  _id: string;
  name: string;
  bio: ClubBioType;
  avatar: { [key: string]: any };
  scores: {
    currentScore: number;
    totalProgress: number;
  };
};

export type DemographicsType = {
  sex: SexEnum;
  skinColor: SkinColorEnum;
  ethnicity: EthnicityEnum;
  ageInterval: AgeIntervalEnum;
};

export enum PositionEnum {
  FRONT = "front",
  BACK = "back",
  RIGHT = "right",
  LEFT = "left",
}

export enum EthnicityEnum {
  WHITE = "white",
  ASIAN = "asian",
  BLACK = "black",
  HISPANIC = "hispanic",
  ARAB = "arab",
  SOUTH_ASIAN = "south_asian",
  NATIVE_AMERICAN = "native_american",
}

export enum SkinColorEnum {
  TYPE1 = "fitzpatrick_1",
  TYPE2 = "fitzpatrick_2",
  TYPE3 = "fitzpatrick_3",
  TYPE4 = "fitzpatrick_4",
  TYPE5 = "fitzpatrick_5",
  TYPE6 = "fitzpatrick_6",
}

export enum AgeIntervalEnum {
  "18-24" = "18-24",
  "24-30" = "24-30",
  "30-36" = "30-36",
  "36-42" = "36-42",
  "42-48" = "42-48",
  "48-56" = "48-56",
  "56-64" = "56-64",
  "64+" = "64+",
}

export type BlurredUrlType = {
  name: "original" | "eyes" | "face";
  url?: string;
};

export type ToAnalyzeType = {
  createdAt: Date;
  mainUrl: BlurredUrlType;
  contentUrlTypes: BlurredUrlType[];
  position: string;
  part: PartEnum | null;
};

export type UserPotentialRecordType = {
  overall: number;
  face: FormattedRatingType | null;
  mouth: FormattedRatingType | null;
  scalp: FormattedRatingType | null;
  body: FormattedRatingType | null;
};

export type UserProgressRecordType = {
  overall: number;
  face: ProgressType | null;
  mouth: ProgressType | null;
  scalp: ProgressType | null;
  body: ProgressType | null;
};

export type UserConcernType = {
  name: string;
  part: PartEnum;
  explanation: string;
  importance: number;
  isDisabled: boolean;
};

export type StreaksType = {
  faceStreak: number;
  mouthStreak: number;
  scalpStreak: number;
  bodyStreak: number;
  clubFaceStreak: number;
  clubMouthStreak: number;
  clubScalpStreak: number;
  clubBodyStreak: number;
};

export type RoutineType = {
  _id: string;
  userId: string;
  type: string;
  part: string;
  concerns: UserConcernType[];
  finalSchedule: { [key: string]: any };
  status: RoutineStatusEnum;
  startsAt: string;
  lastDate: string;
  allTasks: AllTaskType[];
};

export type AllTaskType = {
  ids: { _id: string; startsAt: string; status: string }[];
  name: string;
  description: string;
  instruction: string;
  key: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  unknown: number;
  concern: string;
};

export enum RoutineStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum AuthRedirectToEnum {
  clubMemberRoutines = "clubMemberRoutines",
  clubMemberAbout = "clubMemberAbout",
  routines = "routines",
}

export interface UserDataType extends DefaultUserType {
  _id?: string;
  email?: string | null;
  emailVerified?: boolean;
  auth?: string;
  name: string;
  avatar: { [key: string]: any };
  country: string | null;
  club: ClubDataType | null;
  concerns: UserConcernType[];
  demographics: DemographicsType;
  requiredProgress: RequirementType[];
  toAnalyze: ToAnalyzeType[];
  streaks: StreaksType;
  subscriptions: UserSubscriptionsType;
  nextScan: NextActionType[];
  nextRoutine: NextActionType[];
  potential: UserPotentialRecordType;
  latestProgress: UserProgressRecordType;
  latestScores: FormattedRatingType;
  latestScoresDifference: { [key: string]: number };
  tasks: TaskType[];
  routines: RoutineType[];
  coachEnergy: number;
  nutrition: {
    dailyCalorieGoal: number | null;
    recommendedDailyCalorieGoal: number | null;
    remainingDailyCalories: number | null;
  };
  deleteOn: Date | null;
  canRejoinClubAfter: Date | null;
  nextDiaryRecordAfter: Date | null;
}

export type SubscriptionType = {
  isTrialUsed: boolean;
  subscriptionId: string | null;
  validUntil: Date | null;
};

export type UserSubscriptionsType = {
  improvement: SubscriptionType;
  peek: SubscriptionType;
  advisor: SubscriptionType;
};

export type ProgressImageType = {
  position: string;
  mainUrl: BlurredUrlType;
  urls: BlurredUrlType[];
};

export type ProgressType = {
  _id: string;
  userId: string;
  part: PartEnum;
  sex?: SexEnum;
  createdAt: string;
  initialDate: string;
  images: ProgressImageType[];
  initialImages: ProgressImageType[];
  scores: FormattedRatingType;
  scoresDifference: { [key: string]: any };
  explanation: string;
  specialConsiderations: string | null;
  avatar?: { [key: string]: string };
  userName?: string;
  isPublic: boolean;
};

export interface BeforeAfterType extends ProgressType {
  updatedAt: string;
}

export type StyleGoalsType = {
  name: string;
  description: string;
  icon: string;
};

export type FormattedRatingType = {
  explanations?: { feature: string; explanation: string }[];
} & {
  [key: string]: number;
};

export enum SexEnum {
  MALE = "male",
  FEMALE = "female",
}

export enum ScanTypeEnum {
  PROGRESS = "progress",
  FOOD = "food",
}

export type NextActionType = { part: PartEnum; date: Date | null };

export enum TaskStatusEnum {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired",
  CANCELED = "canceled", // when a user cancels a task
  INACTIVE = "inactive", // when a user changes the routine
  DELETED = "deleted",
}

export type RecipeType = {
  name: string;
  image: string;
  description: string;
  instruction: string;
  canPersonalize: boolean;
};

export type SuggestionType = {
  itemId: string;
  asin: string;
  name: string;
  url: string;
  type: "product" | "place";
  image: string;
  description: string;
  rating: number;
  suggestion: string;
  variant: string;
  rank: number;
  reasoning: string;
  analysisResult: { [key: string]: boolean };
  priceAndUnit: string;
};

export type TaskType = {
  _id: string;
  name: string;
  key: string;
  icon: string;
  color: string;
  part: string;
  startsAt: string;
  completedAt: string;
  expiresAt: string;
  routineId: string;
  requisite: string;
  description: string;
  instruction: string;
  proofEnabled: boolean;
  status: TaskStatusEnum;
  isRecipe: boolean;
  recipe: RecipeType;
  suggestions: SuggestionType[];
  isSubmitted: boolean;
  productTypes: string[];
  proofId: string;
  example: { type: string; url: string };
};
