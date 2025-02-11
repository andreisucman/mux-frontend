import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type Props = {
  value: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>;
};

const updateSpecialConsiderations = async ({ value, setIsLoading, setUserDetails }: Props) => {
  if (!value.trim()) return;

  setIsLoading(true);

  try {
    const response = await callTheServer({
      endpoint: "updateSpecialConsiderations",
      method: "POST",
      body: { text: value },
    });
    if (response.status === 200) {
      setUserDetails(
        (prev: UserDataType) => ({ ...prev, specialConsiderations: value || "" }) as UserDataType
      );
    }
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};

export default updateSpecialConsiderations;
