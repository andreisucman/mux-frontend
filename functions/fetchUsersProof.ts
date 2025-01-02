import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";
import { FetchProofProps } from "./fetchProof";

export default async function fetchUsersProof({
  userName,
  type,
  part,
  query,
  concern,
  sort,
  skip,
  currentArrayLength,
}: FetchProofProps) {
  try {
    let finalEndpoint = `getUsersProofRecords${userName ? `/${userName}` : ""}`;

    const queryParams = [];

    if (query) {
      queryParams.push(`query=${encodeURIComponent(query)}`);
    }

    if (type) {
      queryParams.push(`type=${encodeURIComponent(type)}`);
    }

    if (sort) {
      queryParams.push(`sort=${encodeURIComponent(sort)}`);
    }

    if (part) {
      queryParams.push(`part=${encodeURIComponent(part)}`);
    }

    if (concern) {
      queryParams.push(`concern=${encodeURIComponent(concern)}`);
    }

    if (skip && currentArrayLength && currentArrayLength > 0) {
      queryParams.push(`skip=${currentArrayLength}`);
    }

    if (queryParams.length > 0) {
      finalEndpoint += `?${queryParams.join("&")}`;
    }

    const response = await callTheServer({
      endpoint: finalEndpoint,
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error(response.error);
    }

    return response.message;
  } catch (err) {
    openErrorModal();
  }
}
