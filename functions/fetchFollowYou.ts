import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchFollowYouProps = {
  skip: boolean;
  existingCount?: number;
};

const fetchFollowYou = async (props?: FetchFollowYouProps) => {
  const { skip, existingCount } = props || {};

  try {
    let endpoint = "getFollowYou";

    if (skip && existingCount) {
      endpoint += `?skip=${existingCount}`;
    }

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error(response.error);
    }

    return response.message;
  } catch (err) {
    openErrorModal();
    console.log("Error in fetchFollowYou: ", err);
  }
};

export default fetchFollowYou;
