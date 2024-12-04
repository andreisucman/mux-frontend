import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthStateEnum } from "@/context/UserContext/types";
import openErrorModal from "@/helpers/openErrorModal";
import { AuthRedirectToEnum, UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type AuthenticateProps = {
  code?: string;
  state: string | null;
  router: AppRouterInstance;
  setStatus: React.Dispatch<React.SetStateAction<AuthStateEnum>>;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDataType | null>>;
};

const authenticate = async ({
  code,
  state,
  router,
  setStatus,
  setUserDetails,
}: AuthenticateProps) => {
  try {
    const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
    const { localUserId, redirectTo, followingUserId } = parsedState;

    const response = await callTheServer({
      endpoint: "authenticate",
      method: "POST",
      body: {
        code,
        localUserId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        state,
      },
    });

    if (response.status === 200) {
      if (response.error) {
        if (response.error === "blocked") {
          openErrorModal({
            title: `🚨 Account blocked`,
            description: `We have temporarily blocked your account while we investigate a potential violation of our Terms of Service. Please check your email for more details.`,
          });
          setStatus(AuthStateEnum.UNAUTHENTICATED);
          return;
        }

        openErrorModal({
          description: response.error,
        });
        setStatus(AuthStateEnum.UNAUTHENTICATED);
        return;
      }

      setUserDetails((prev) => ({ ...prev, ...response.message }) as UserDataType);
      setStatus(AuthStateEnum.AUTHENTICATED);

      if (redirectTo === AuthRedirectToEnum.clubMemberRoutines) {
        router.replace(`/club/routines?followingUserId=${followingUserId}`);
      } else if (redirectTo === AuthRedirectToEnum.clubMemberAbout) {
        router.replace(`/club/about?followingUserId=${followingUserId}`);
      } else {
        router.replace("/routines");
      }
    } else {
      const rejected = response.status === 401 || response.status === 403;
      if (rejected) {
        setStatus(AuthStateEnum.UNAUTHENTICATED);
      }
    }
  } catch (err) {
    console.log(`Error in handleAuthenticate: `, err);
  }
};

export default authenticate;
