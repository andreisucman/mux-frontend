import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type GetClubTrackYouProps = {
  skip: boolean;
  existingCount?: number;
};

const fetchClubTrackYou = async (props?: GetClubTrackYouProps) => {
  const { skip, existingCount } = props || {};

  try {
    let endpoint = "getClubTrackYou";

    if (skip && existingCount) {
      endpoint += `?skip=${existingCount}`;
    }

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    return response.message;
  } catch (err) {
    openErrorModal();
    console.log("Error in fetchClubTrackYou: ", err);
  }
};

export default fetchClubTrackYou;
