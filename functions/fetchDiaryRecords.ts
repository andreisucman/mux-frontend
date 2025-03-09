import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchDiaryRecordsProps = {
  userName?: string;
  sort: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  dateFrom: string | null;
  dateTo: string | null;
};

const fetchDiaryRecords = async (props: FetchDiaryRecordsProps | undefined) => {
  const { skip, userName, sort, dateFrom, dateTo, currentArrayLength } = props || {};
  try {
    let endpoint = "getDiaryRecords";

    if (userName) endpoint += `/${userName}`;

    const parts = [];

    if (skip && currentArrayLength) {
      parts.push(`skip=${currentArrayLength}`);
    }

    if (sort) {
      parts.push(`sort=${sort}`);
    }

    if (dateFrom && dateTo) {
      parts.push(`dateFrom=${dateFrom}&dateTo=${dateTo}`);
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
  }
};

export default fetchDiaryRecords;
