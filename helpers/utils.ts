export function delayExecution(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRingColor(score: number, isPotential?: boolean) {
  return score <= 65
    ? isPotential
      ? "orange.7"
      : "orange.9"
    : isPotential
      ? "green.7"
      : "green.9";
}
export function calculateCircleRadius(rectWidth: number, rectHeight: number, numCircles: number) {
  let circlesPerRow = Math.ceil(Math.sqrt(numCircles * (rectWidth / rectHeight)));
  let circlesPerCol = Math.ceil(numCircles / circlesPerRow);

  const diameterWidth = rectWidth / circlesPerRow;
  const diameterHeight = rectHeight / circlesPerCol;

  return Math.min(diameterWidth, diameterHeight);
}

export function normalizeString(string: string) {
  if (!string) return "";
  const normalized = string
    .split(/[\s_]+/)
    .join(" ")
    .toLowerCase();
  return normalized[0].toUpperCase() + normalized.slice(1);
}
