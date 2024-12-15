import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchDiaryRecordsProps = {
  type: string | null;
  currentArrayLength?: number;
  skip?: boolean;
};

const fetchDiaryRecords = async (props: FetchDiaryRecordsProps | undefined) => {
  const { skip, type, currentArrayLength } = props || {};
  try {
    let endpoint = "getDiaryRecords";

    const parts = [];

    if (skip && currentArrayLength) {
      parts.push(`skip=${currentArrayLength}`);
    }
    if (type) {
      parts.push(`type=${type}`);
    }

    const query = parts.join("&");
    endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    return response;
  } catch (err) {
    openErrorModal();
    console.log("Error in fetchDiaryRecords: ", err);
  }
};

export default fetchDiaryRecords;
