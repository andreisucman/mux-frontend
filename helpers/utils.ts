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
  // Try to find the optimal number of rows and columns that fit the circles
  let circlesPerRow = Math.ceil(Math.sqrt(numCircles * (rectWidth / rectHeight)));
  let circlesPerCol = Math.ceil(numCircles / circlesPerRow);

  // Calculate the maximum diameter based on the rectangle's width and height
  const diameterWidth = rectWidth / circlesPerRow;
  const diameterHeight = rectHeight / circlesPerCol;

  // The final diameter is the minimum of the two to ensure circles fit
  return Math.min(diameterWidth, diameterHeight);
}
