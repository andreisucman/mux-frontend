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

export function getLineIndicatorColor(score: number) {
  let color = "var(--mantine-color-green-7)";
  if (score < 7) {
    color = "var(--mantine-color-orange-7)";
  }
  if (score < 3) {
    color = "var(--mantine-color-red-7)";
  }
  return color;
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
  const mimeTypes = [
    "video/webm;codecs=h264,opus",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
  ];

  return mimeTypes.find(MediaRecorder.isTypeSupported) || "video/webm;codecs=vp8";
}

export const validateEmail = (val: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(val);
};

export function validateUrl(url: string) {
  if (!url) return false;
  try {
    const secure = url.startsWith("https://");
    if (!secure) return false;

    const parsedUrl = new URL(url);

    const domain = parsedUrl.hostname;

    const hasValidExtension = /\.[a-z]{2,}$/i.test(domain);

    if (!hasValidExtension) return false;

    return true;
  } catch (e) {
    return false;
  }
}

export function sortObjectByNumberValue(obj: { [key: string]: number }, isAscending: boolean) {
  return Object.fromEntries(
    isAscending
      ? Object.entries(obj).sort(([, a], [, b]) => a - b)
      : Object.entries(obj).sort(([, a], [, b]) => b - a)
  );
}
