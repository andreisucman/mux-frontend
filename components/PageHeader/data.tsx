export const partItems = [
  { label: "Face", value: "face" },
  { label: "Mouth", value: "mouth" },
  { label: "Scalp", value: "scalp" },
  { label: "Body", value: "body" },
];

export const taskStatuses = [
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
  { label: "Expired", value: "expired" },
];

export const positionItems = [
  {
    label: "Front",
    value: "front",
    parts: ["face", "body", "scalp", "mouth"],
  },
  { label: "Right", value: "right", parts: ["face", "body"] },
  { label: "Left", value: "left", parts: ["face", "body"] },
  { label: "Back", value: "back", parts: ["body"] },
];

export const clubPageTypeItems: { label: string; value: string }[] = [
  { label: "About", value: "about" },
  { label: "Routines", value: "routines" },
  { label: "Results", value: "progress" },
  { label: "Diary", value: "diary" },
  { label: "Answers", value: "answers" },
];
