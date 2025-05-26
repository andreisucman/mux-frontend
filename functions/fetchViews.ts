import callTheServer from "./callTheServer";

type FetchPurchasesProps = {
  skip: boolean;
  page: "routines" | "progress" | "diary" | "proof";
  interval: "day" | "week" | "month";
  existingCount?: number;
};

const fetchViews = async (props?: FetchPurchasesProps) => {
  const { skip, page = "routines", interval = "day", existingCount } = props || {};

  let endpoint = "getTotalViews";

  const searchParams = new URLSearchParams();

  if (interval) {
    searchParams.set("interval", interval);
  }
  if (page) {
    searchParams.set("page", page);
  }
  if (skip && existingCount) {
    searchParams.set("skip", String(existingCount));
  }

  const query = searchParams.toString();
  if (query) endpoint += `?${query}`;

  const response = await callTheServer({
    endpoint,
    method: "GET",
  });

  return response.message;
};

export default fetchViews;
