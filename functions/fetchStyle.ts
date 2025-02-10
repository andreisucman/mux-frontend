import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

export type FetchStyleProps = {
  followingUserName?: string | string[];
  styleName?: string | null;
  sort?: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  sex?: string | null;
  ageInterval?: string | null;
  ethnicity?: string | null;
};

export default async function fetchStyle({
  styleName,
  skip,
  sort,
  sex,
  ageInterval,
  ethnicity,
  currentArrayLength,
}: FetchStyleProps) {
  try {
    let finalEndpoint = `getAllStyleRecords`;

    const queryParams = [];

    if (sort) {
      queryParams.push(`sort=${sort}`);
    }

    if (sex) {
      queryParams.push(`sex=${sex}`);
    }

    if (ageInterval) {
      queryParams.push(`ageInterval=${ageInterval}`);
    }

    if (ethnicity) {
      queryParams.push(`ethnicity=${ethnicity}`);
    }

    if (styleName) {
      queryParams.push(`styleName=${styleName}`);
    }

    if (skip && currentArrayLength) {
      queryParams.push(`skip=${currentArrayLength}`);
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
