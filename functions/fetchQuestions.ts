import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchQuestionsProps = {
  skip?: number | null;
  searchQuery?: string;
  userName?: string | string[];
  showType?: string | null;
  onlyCheck?: boolean;
};

const fetchQuestions = async ({
  skip,
  userName,
  searchQuery,
  showType,
  onlyCheck,
}: FetchQuestionsProps) => {
  try {
    let endpoint = userName ? `getAboutQuestions/${userName}` : "getAboutQuestions";

    const parts = [];

    if (onlyCheck) {
      parts.push(`onlyCheck=true`);
    } else {
      if (searchQuery) parts.push(`query=${searchQuery}`);
      if (showType) parts.push(`showType=${showType}`);
      if (skip) parts.push(`skip=${skip}`);
    }

    if (parts.length > 0) endpoint += `?${parts.join("&")}`;

    const response = await callTheServer({ endpoint, method: "GET" });

    if (response.status === 200) {
      return response.message;
    } else {
      openErrorModal();
    }
  } catch (err) {
    console.log("Error in fetchQuestions: ", err);
  }
};

export default fetchQuestions;
