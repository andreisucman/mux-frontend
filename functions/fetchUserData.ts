import { AuthStateEnum } from "@/context/UserContext/types";
import { clearCookies } from "@/helpers/cookies";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type FetchUerDataProps = {
  setStatus?: React.Dispatch<React.SetStateAction<Partial<AuthStateEnum> | null>>;
  setUserDetails?: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>;
};

const fetchUserData = async (props?: FetchUerDataProps): Promise<UserDataType | null> => {
  const { setStatus, setUserDetails } = props || {};

  let data = null;
  try {
    const response = await callTheServer({
      endpoint: "getUserData",
      method: "GET",
    });

    if (response.status === 200) {
      data = response.message;

      if (setUserDetails) setUserDetails(data);
    }

    if (response.status === 404) {
      if (setStatus) setStatus(AuthStateEnum.UNAUTHENTICATED);
    }

    if (response.status === 402) {
      openErrorModal({
        description: "Account blocked. Please check your email for details.",
      });
      clearCookies();
    }
  } catch (err) {
  } finally {
    return data;
  }
};

export default fetchUserData;
