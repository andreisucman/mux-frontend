import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

const fetchUserData = async (
  setUserDetails?: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>>
): Promise<UserDataType | null> => {
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

    if (response.status === 402) {
      openErrorModal({
        description: "Account blocked. Please check your email for details.",
      });
    }
  } catch (err) {
    console.log("Error in fetchUserData: ", err);
  } finally {
    return data;
  }
};

export default fetchUserData;
