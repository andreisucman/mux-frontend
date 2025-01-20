import { ChatCategoryEnum } from "@/app/diary/type";

export const conversationStarters = {
  [ChatCategoryEnum.ANSWERS]: [],
  [ChatCategoryEnum.DIARY]: [],
  [ChatCategoryEnum.FOOD]: [],
  [ChatCategoryEnum.PRODUCT]: [],
  [ChatCategoryEnum.ROUTINE]: [],
  [ChatCategoryEnum.STYLE]: [],
  [ChatCategoryEnum.TASK]: [
    "what other products can i use",
    "what alternative task that targets the same concern can you suggest",
  ],
};
