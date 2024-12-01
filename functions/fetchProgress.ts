import callTheServer from "./callTheServer";

export type FetchProgressProps = {
  trackedUserId?: string | null;
  type: string;
  part: string | null;
  skip?: boolean;
  currentArrayLength?: number;
};

export default async function fetchProgress({
  trackedUserId,
  type,
  part,
  skip,
  currentArrayLength,
}: FetchProgressProps) {
  try {
    let finalEndpoint = `getUsersProgressRecords${trackedUserId ? `/${trackedUserId}` : ""}`;

    const queryParams = [];

    if (type) {
      queryParams.push(`type=${type}`);
    }

    if (part) {
      queryParams.push(`part=${part}`);
    }

    if (skip && currentArrayLength) {
      queryParams.push(`skip=${currentArrayLength}`);
    }

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
