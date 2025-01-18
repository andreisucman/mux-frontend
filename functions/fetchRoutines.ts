import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchRoutinesProps = {
  skip?: boolean;
  sort: string | null;
  followingUserName?: string | string[];
  routinesLength: number;
  type?: string;
};

const fetchRoutines = async ({
  skip,
  sort,
  followingUserName,
  routinesLength,
  type,
}: FetchRoutinesProps) => {
  try {
    let endpoint = "getRoutines";

    if (followingUserName) endpoint += `/${followingUserName}`;

    const parts = [];

    if (type) {
      parts.push(`type=${type}`);
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

    if (response.error) {
      openErrorModal({ description: response.error });
      return;
    }

    return response.message;
  } catch (err) {
    openErrorModal();
  }
};

export default fetchRoutines;
