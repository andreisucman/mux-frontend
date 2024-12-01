import callTheServer from "./callTheServer";

export type FetchStyleProps = {
  trackedUserId?: string | null;
  styleName?: string | null;
  currentArrayLength?: number;
  skip?: boolean;
  type: string;
  sex?: string | null;
  ageInterval?: string | null;
  ethnicity?: string | null;
};

export default async function fetchStyle({
  type,
  styleName,
  skip,
  sex,
  ageInterval,
  ethnicity,
  currentArrayLength,
}: FetchStyleProps) {
  try {
    let finalEndpoint = `getAllStyleRecords`;

    const queryParams = [];

    if (type) {
      queryParams.push(`type=${type}`);
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
    console.log("Error in fetchStyle: ", err);
    throw err;
  }
}
