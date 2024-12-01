import callTheServer from "./callTheServer";
import { FetchStyleProps } from "./fetchStyle";

export default async function fetchUsersStyle({
  trackedUserId,
  styleName,
  type,
  skip,
  currentArrayLength,
}: FetchStyleProps) {
  try {
    let finalEndpoint = `getUsersStyleRecords${trackedUserId ? `/${trackedUserId}` : ""}`;

    const queryParams = [];

    if (type) {
      queryParams.push(`type=${type}`);
    }

    if (styleName) {
      queryParams.push(`styleName=${styleName}`);
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
    console.log("Error in fetchUsersStyle: ", err);
    throw err;
  }
}
