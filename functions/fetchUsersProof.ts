import callTheServer from "./callTheServer";
import { FetchProofProps } from "./fetchProof";

export default async function fetchUsersProof({
  trackedUserId,
  type,
  part,
  query,
  concern,
  skip,
  currentArray,
}: FetchProofProps) {
  try {
    let finalEndpoint = `getUsersProofRecords${trackedUserId ? `/${trackedUserId}` : ""}`;

    const queryParams = [];

    if (query) {
      queryParams.push(`query=${encodeURIComponent(query)}`);
    }

    if (type) {
      queryParams.push(`type=${encodeURIComponent(type)}`);
    }

    if (part) {
      queryParams.push(`part=${encodeURIComponent(part)}`);
    }

    if (concern) {
      queryParams.push(`concern=${encodeURIComponent(concern)}`);
    }

    if (skip && currentArray && currentArray.length > 0) {
      queryParams.push(`skip=${currentArray}`);
    }

    if (queryParams.length > 0) {
      finalEndpoint += `?${queryParams.join("&")}`;
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
    console.log("Error in fetchUsersProof: ", err);
    throw err;
  }
}
