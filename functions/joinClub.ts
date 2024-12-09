import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { genConfig, Sex } from "react-nice-avatar";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { EthnicityEnum, UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type Props = {
  closeModal: boolean;
  redirectPath: string | null;
  router: AppRouterInstance;
  userDetails?: Partial<UserDataType | null>;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>;
};

const skinColorMap = {
  white: "#f5e6da",
  asian: "#d1a67c",
  black: "#5b3a29",
  hispanic: "#a47448",
  arab: "#c89f7c",
  south_asian: "#8c6239",
  native_american: "#b57c53",
};

const map: { [key: string]: string } = { male: "man", female: "woman" };

export default async function joinClub({
  router,
  userDetails,
  redirectPath,
  closeModal,
  setUserDetails,
}: Props) {
  try {
    const { demographics } = userDetails || {};
    const { sex, ethnicity } = demographics || {};

    const avatarConfig = genConfig({
      sex: map[sex || "male"] as Sex,
      faceColor: skinColorMap[ethnicity as EthnicityEnum],
      mouthStyle: "peace",
      glassesStyle: "none",
      hairColorRandom: true,
      isGradient: true,
    });

    const response = await callTheServer({
      endpoint: "joinClub",
      method: "POST",
      body: { avatar: avatarConfig },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }
      
      setUserDetails((prev: UserDataType | null) => ({
        ...prev,
        ...response.message,
      }));

      if (redirectPath) router.push(redirectPath);
      if (closeModal) modals.closeAll();
    }
  } catch (err: any) {
    console.log("Error in joinClub: ", err);
  }
}
