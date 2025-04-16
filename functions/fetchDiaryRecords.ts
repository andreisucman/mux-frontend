import callTheServer from "./callTheServer";

type FetchDiaryRecordsProps = {
  userName?: string;
  sort: string | null;
  concern: string | null;
  part: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  dateFrom: string | null;
  dateTo: string | null;
};

const fetchDiaryRecords = async (props: FetchDiaryRecordsProps | undefined) => {
  const { skip, userName, sort, part, concern, dateFrom, dateTo, currentArrayLength } = props || {};
  let endpoint = "getDiary";

  if (userName) endpoint += `/${userName}`;

  const parts = [];

  if (skip && currentArrayLength) parts.push(`skip=${currentArrayLength}`);
  if (concern) parts.push(`concern=${concern}`);
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
