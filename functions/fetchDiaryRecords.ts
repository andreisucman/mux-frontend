import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchDiaryRecordsProps = {
  userName?: string;
  sort: string | null;
  part: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  dateFrom: string | null;
  dateTo: string | null;
};

const fetchDiaryRecords = async (props: FetchDiaryRecordsProps | undefined) => {
  const { skip, userName, sort, part, dateFrom, dateTo, currentArrayLength } = props || {};
  let endpoint = "getDiaryRecords";

  if (userName) endpoint += `/${userName}`;

  const parts = [];

  if (skip && currentArrayLength) parts.push(`skip=${currentArrayLength}`);
  if (part) parts.push(`part=${part}`);
  if (sort) parts.push(`sort=${sort}`);
  if (dateFrom && dateTo) parts.push(`dateFrom=${dateFrom}&dateTo=${dateTo}`);

  const query = parts.join("&");
  endpoint += `?${query}`;

  const response = await callTheServer({
    endpoint,
    method: "GET",
  });

  return response.message;
};

export default fetchDiaryRecords;
