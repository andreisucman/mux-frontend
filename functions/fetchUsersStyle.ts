import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";
import { FetchStyleProps } from "./fetchStyle";

export default async function fetchUsersStyle({
  followingUserName,
  styleName,
  sort,
  skip,
  currentArrayLength,
}: FetchStyleProps) {
  try {
    let finalEndpoint = `getUsersStyleRecords${followingUserName ? `/${followingUserName}` : ""}`;

    const queryParams = [];

    if (sort) {
      queryParams.push(`sort=${sort}`);
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
    openErrorModal();
  }
}
