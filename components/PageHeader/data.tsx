export const typeItems = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
  { label: "Health", value: "health" },
];

export const partItems = [
  { label: "Face", value: "face", type: "head" },
  { label: "Mouth", value: "mouth", type: "head" },
  { label: "Scalp", value: "scalp", type: "head" },
];

export const positionItems = [
  { label: "Front", value: "front", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Right", value: "right", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Left", value: "left", types: ["head", "body"], parts: ["face", "body"] },
  { label: "Back", value: "back", types: ["body"], parts: ["body"] },
];
