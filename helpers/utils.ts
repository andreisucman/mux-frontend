import { AllTaskType, TaskStatusEnum } from "@/types/global";

export function delayExecution(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRingColor(score: number) {
  return score < 0 ? "red.7" : score <= 65 ? "orange.7" : "gren.7";
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

export const getIsRoutineActive = (startsAt: string, lastDate: string, allTasks: AllTaskType[]) => {
  const now = new Date();
  const withinDateRange = new Date(startsAt) <= now && now <= new Date(lastDate);
  const hasActiveTasks = allTasks
    .flatMap((at) => at.ids)
    .some((idObj) => idObj.status === TaskStatusEnum.ACTIVE);

  return withinDateRange && hasActiveTasks;
};
