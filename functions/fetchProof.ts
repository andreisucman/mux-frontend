import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

export type FetchProofProps = {
  userName?: string | string[];
  part: string | null;
  query: string | null;
  concern: string | null;
  sort: string | null;
  sex?: string | null;
  ageInterval?: string | null;
  ethnicity?: string | null;
  skip?: boolean;
  currentArrayLength?: number;
};

export default async function fetchProof({
  sex,
  ageInterval,
  ethnicity,
  part,
  query,
  skip,
  currentArrayLength,
}: FetchProofProps) {
  try {
    let finalEndpoint = "getAllProofRecords";

    const queryParams = [];

    if (query) {
      queryParams.push(`query=${encodeURIComponent(query)}`);
    }

    if (part) {
      queryParams.push(`part=${encodeURIComponent(part)}`);
    }

    if (ethnicity) {
      queryParams.push(`ethnicity=${encodeURIComponent(ethnicity)}`);
    }

    if (sex) {
      queryParams.push(`sex=${encodeURIComponent(sex)}`);
    }

    if (ageInterval) {
      queryParams.push(`ageInterval=${encodeURIComponent(ageInterval)}`);
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
