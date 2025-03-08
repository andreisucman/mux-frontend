import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchRoutinesProps = {
  skip?: boolean;
  part: string | null;
  sort: string | null;
  followingUserName?: string | string[];
  routinesLength: number;
};

const fetchRoutines = async ({
  skip,
  sort,
  part,
  followingUserName,
  routinesLength,
}: FetchRoutinesProps) => {
  try {
    let endpoint = "getRoutines";

    if (followingUserName) endpoint += `/${followingUserName}`;

    const parts = [];

    if (part) {
      parts.push(`part=${part}`);
    }

    if (sort) {
      parts.push(`sort=${sort}`);
    }

    if (skip && routinesLength > 0) {
      parts.push(`skip=${routinesLength}`);
    }

    const query = parts.join("&");

    if (query) endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error(response.error);
    }

    return response;
  } catch (err) {
    openErrorModal();
  }
};

export default fetchRoutines;
