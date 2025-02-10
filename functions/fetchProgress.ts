import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

export type FetchProgressProps = {
  userName?: string | string[];
  type: string | null;
  part: string | null;
  position: string | null;
  skip?: boolean;
  sort: string | null;
  currentArrayLength?: number;
};

export default async function fetchProgress({
  userName,
  type,
  part,
  position,
  skip,
  sort,
  currentArrayLength,
}: FetchProgressProps) {
  try {
    let finalEndpoint = `getUsersProgressRecords${userName ? `/${userName}` : ""}`;

    const queryParams = [];

    if (sort) {
      queryParams.push(`sort=${sort}`);
    }

    if (part) {
      queryParams.push(`part=${part}`);
    }

    if (position) {
      queryParams.push(`position=${position}`);
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
  } catch (err) {
    openErrorModal();
  }
}
