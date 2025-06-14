import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import { AuthStateEnum } from "@/context/UserContext/types";
import { AllTaskType, RoutineType, TaskStatusEnum } from "@/types/global";
import openAuthModal from "./openAuthModal";

export function delayExecution(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export const getIsRoutineActive = (startsAt: string, lastDate: string, allTasks: AllTaskType[]) => {
  const now = new Date();
  const withinDateRange = new Date(startsAt) <= now && now <= new Date(lastDate);
  const hasActiveTasks = allTasks
    .flatMap((at) => at.ids)
    .some((idObj) => idObj.status === TaskStatusEnum.ACTIVE);

  return withinDateRange && hasActiveTasks;
};

export const getConcernsOfRoutines = (data: RoutineType[]) =>
  data.reduce((a: { [key: string]: string[] }, c: RoutineType) => {
    a[c._id] = [...new Set(c.allTasks.map((t) => t.concern))];
    return a;
  }, {});

export const deduplicateRoutines = (
  previousRoutines: RoutineType[],
  newRoutines: RoutineType[],
  sort: string
) => {
  const updatedRoutines = [...previousRoutines];

  for (let i = 0; i < newRoutines.length; i++) {
    const index = previousRoutines.findIndex((r) => r._id === newRoutines[i]._id);
    if (index !== -1) {
      updatedRoutines[index] = { ...previousRoutines[index], ...newRoutines[i] };
    } else {
      updatedRoutines.push(newRoutines[i]);
    }
  }

  updatedRoutines.sort((a, b) =>
    sort === "startsAt"
      ? new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      : new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
  );

  return updatedRoutines;
};

export function matchBySegments(basePath: string, candidatePath: string) {
  const baseSegs = basePath.split("/").filter(Boolean);
  const candSegs = candidatePath.split("/").filter(Boolean);
  if (candSegs.length < baseSegs.length) return false;
  return baseSegs.every((seg, idx) => seg === candSegs[idx]);
}

export const ensureLogin = (
  status: AuthStateEnum,
  referrer: ReferrerEnum,
  userId: string,
  redirectPath: string,
  redirectQuery?: string
) => {
  if (status !== AuthStateEnum.AUTHENTICATED) {
    openAuthModal({
      title: "Sign in",
      stateObject: {
        referrer,
        localUserId: userId,
        redirectPath,
        redirectQuery,
      },
    });

    return true;
  }
  return false;
};
