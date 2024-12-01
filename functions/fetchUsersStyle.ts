import callTheServer from "./callTheServer";

export type FetchUsersStyleProps = {
  trackedUserId?: string | null;
  styleName?: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  type: string;
};

export default async function fetchUsersStyle({
  trackedUserId,
  type,
  styleName,
  skip,
  currentArrayLength,
}: FetchUsersStyleProps) {
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
