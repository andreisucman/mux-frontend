import callTheServer from "./callTheServer";

export type FetchProgressProps = {
  userName?: string | string[];
  type: string | null;
  part: string | null;
  position: string | null;
  skip?: boolean;
  currentArrayLength?: number;
};

export default async function fetchProgress({
  userName,
  type,
  part,
  position,
  skip,
  currentArrayLength,
}: FetchProgressProps) {
  try {
    let finalEndpoint = `getUsersProgressRecords${userName ? `/${userName}` : ""}`;

    const queryParams = [];

    if (type) {
      queryParams.push(`type=${type}`);
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
    console.log("Error in fetchProgress: ", err);
    throw err;
  }
}
