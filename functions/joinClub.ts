import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type Props = {
  closeModal: boolean;
  redirectPath: string | null;
  router: AppRouterInstance;
  userDetails?: Partial<UserDataType | null>;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>;
};

export default async function joinClub({
  router,
  redirectPath,
  closeModal,
  setUserDetails,
}: Props) {
  try {
    const response = await callTheServer({
      endpoint: "joinClub",
      method: "POST",
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

    return response.status === 200;
  } catch (err: any) {}
}
