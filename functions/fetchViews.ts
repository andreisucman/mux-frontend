import callTheServer from "./callTheServer";

type FetchPurchasesProps = {
  skip: boolean;
  existingCount?: number;
};

const fetchViews = async (props?: FetchPurchasesProps) => {
  const { skip, existingCount } = props || {};

  let endpoint = "getViews";

  const parts = [];

  if (skip && existingCount) {
    parts.push(`skip=${existingCount}`);
  }

  const query = parts.join("&");
  if (query) endpoint += `?${query}`;

  const response = await callTheServer({
    endpoint,
    method: "GET",
  });

  return response.message;
};

export default fetchViews;
