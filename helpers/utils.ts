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

export function decodeAndCheckUriComponent(encodedUri: string) {
  const decoded = decodeURIComponent(encodedUri);

  if (!decoded.startsWith("/") || decoded.includes("javascript:")) {
    return null;
  }

  return decoded;
}

export function parseScanDate(scanRecord?: { date: Date | null }) {
  return scanRecord?.date ? new Date(scanRecord.date) : null;
}

export function daysFrom({ date = new Date(), days = 0 }) {
  return new Date(new Date(date).getTime() + days * 24 * 60 * 60 * 1000);
}

export function getSupportedMimeType() {
  const supportsMp4 = MediaRecorder.isTypeSupported("video/mp4");
  const supportsV9 = MediaRecorder.isTypeSupported("video/webm;codecs=vp9");
  const mimeType = supportsMp4
    ? "video/mp4"
    : supportsV9
      ? "video/webm;codecs=vp9"
      : "video/webm;codecs=vp8";

  return mimeType;
}
