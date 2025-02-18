import { ChatCategoryEnum } from "@/app/diary/type";

export default function getConversationStarters(chatCategory?: ChatCategoryEnum, isClub?: boolean) {
  const starters = [];

  switch (chatCategory) {
    case ChatCategoryEnum.ANSWERS:
      starters.push(
        `what did ${isClub ? "they" : "i"} say about ...`,
        `what was ${isClub ? "their" : "my"} favorite ...`
      );
      break;
    case ChatCategoryEnum.DIARY:
      starters.push(`what feedback ${isClub ? "they" : "i"} left about the minoxidil task`);
      break;
    case ChatCategoryEnum.FOOD:
      starters.push(
        `what can i add to this food to make it ...`,
        `what i ate today`,
        `when i had fried potatoes last time`
      );
      break;
    case ChatCategoryEnum.GENERAL:
      starters.push(
        `what type of glasses will look good on me ...`,
        `will beard look good on me or should i shave clean`,
        `how can i look more feminine`
      );
      break;
    case ChatCategoryEnum.PRODUCT:
      starters.push(`which of these is best for me?`, `i need one without hemp`);
      break;
    case ChatCategoryEnum.ROUTINE:
      starters.push(
        `what tasks ${isClub ? "they" : "i"} have on friday`,
        `what routine ${isClub ? "they" : "i"} stole from ...`
      );
      break;
    case ChatCategoryEnum.TASK:
      starters.push(`which task should i complete first`);
      break;
  }

  return starters;
}
