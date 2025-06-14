import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

export type FetchProgressProps = {
  userName?: string | string[];
  concern: string | null;
  skip?: boolean;
  sort: string | null;
  currentArrayLength?: number;
};

export default async function fetchProgress({
  userName,
  concern,
  skip,
  sort,
  currentArrayLength,
}: FetchProgressProps) {
  let finalEndpoint = `getProgress${userName ? `/${userName}` : ""}`;

  const queryParams = [];

  if (sort) {
    queryParams.push(`sort=${sort}`);
  }

  if (concern) {
    queryParams.push(`concern=${concern}`);
  }

  if (skip && currentArrayLength) {
    queryParams.push(`skip=${currentArrayLength}`);
  }

  const query = queryParams.join("&");

  if (query) finalEndpoint += `?${query}`;

  const response = await callTheServer({
    endpoint: finalEndpoint,
    method: "GET",
  });

  if (response.status !== 200) {
    throw new Error(response.error);
  }

  return response.message;
}
