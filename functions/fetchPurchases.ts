import callTheServer from "./callTheServer";

type FetchPurchasesProps = {
  skip: boolean;
  existingCount?: number;
  type?: "buyer" | "seller";
};

const fetchPurchases = async (props?: FetchPurchasesProps) => {
  const { skip, existingCount, type } = props || {};

  let endpoint = "getPurchases";

  const parts = [];

  if (skip && existingCount) {
    parts.push(`skip=${existingCount}`);
  }

  if (type) {
    parts.push(`type=${type}`);
  }

  const query = parts.join("&");
  if (query) endpoint += `?${query}`;

  const response = await callTheServer({
    endpoint,
    method: "GET",
  });

  return response.message;
};

export default fetchPurchases;
