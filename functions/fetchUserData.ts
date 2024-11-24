import { preventFetchingPaths } from "@/data/paths";
import callTheServer from "./callTheServer";

const fetchUserData = async (pathname: string) => {
  if (preventFetchingPaths.includes(pathname)) return;

  try {
    const response = await callTheServer({
      endpoint: "getUserData",
      method: "GET",
    });

    if (response.status === 200) {
      return response.message;
    }
  } catch (err) {
    console.log("Error in fetchUserData: ", err);
  }
};

export default fetchUserData;
