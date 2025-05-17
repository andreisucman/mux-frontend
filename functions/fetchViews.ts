import callTheServer from "./callTheServer";

type FetchPurchasesProps = {
  skip: boolean;
  interval: "day" | "week" | "month";
  existingCount?: number;
};

const fetchViews = async (props?: FetchPurchasesProps) => {
  const { skip, interval = "day", existingCount } = props || {};

  let endpoint = "getTotalViews";

  const searchParams = new URLSearchParams();

  if (interval) {
    searchParams.set("interval", interval);
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
