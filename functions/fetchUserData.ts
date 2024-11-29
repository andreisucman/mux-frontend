import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

const fetchUserData = async (
  setUserDetails?: React.Dispatch<React.SetStateAction<UserDataType>>
): Promise<UserDataType | undefined> => {
  try {
    const response = await callTheServer({
      endpoint: "getUserData",
      method: "GET",
    });

    if (response.status === 200) {
      if (setUserDetails) setUserDetails(response.message);
      return response.message;
    }
  } catch (err) {
    console.log("Error in fetchUserData: ", err);
  }
};

export default fetchUserData;
