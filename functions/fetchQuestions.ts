import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type FetchQuestionsProps = {
  skip?: number | null;
  userName?: string | string[];
  onlyCheck?: boolean;
};

const fetchQuestions = async ({ skip, userName, onlyCheck }: FetchQuestionsProps) => {
  try {
    let endpoint = userName ? `getAboutQuestions/${userName}` : "getAboutQuestions";

    if (onlyCheck) {
      endpoint += `?onlyCheck=true`;
    } else {
      if (skip) endpoint += `?skip=${skip}`;
    }

    const response = await callTheServer({ endpoint, method: "GET" });

    if (response.status === 200) {
      return response.message;
    } else {
      openErrorModal();
    }
  } catch (err) {
    openErrorModal();
  }
};

export default fetchQuestions;
