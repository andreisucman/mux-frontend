import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthStateEnum } from "@/context/UserContext/types";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import callTheServer from "./callTheServer";

type AuthenticateProps = {
  code?: string;
  state: string | null;
  email?: string;
  password?: string;
  router: AppRouterInstance;
  setStatus: React.Dispatch<React.SetStateAction<AuthStateEnum>>;
  setUserDetails: React.Dispatch<React.SetStateAction<Partial<UserDataType | null>>>;
};

const authenticate = async ({
  code,
  state,
  router,
  email,
  password,
  setStatus,
  setUserDetails,
}: AuthenticateProps) => {
  try {
    const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
    const { redirectPath, redirectQuery } = parsedState;

    const response = await callTheServer({
      endpoint: "authenticate",
      method: "POST",
      body: {
        state,
        code,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        email,
        password,
      },
    });

    if (response.status === 200) {
      if (response.error) {
        if (response.error === "blocked") {
          openErrorModal({
            title: `🚨 Account blocked`,
            description: `We have temporarily blocked your account while we investigate a potential violation of our Terms of Service. Check your email for more details.`,
          });
          setStatus(AuthStateEnum.UNAUTHENTICATED);
          return;
        }

        if (response.error === "suspended") {
          openErrorModal({
            title: `🚨 Account suspended`,
            description: `This account is permanently suspended for violation of our Terms of Service.`,
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

      let redirectUrl = "/tasks";

      if (redirectPath) redirectUrl = redirectPath;
      if (redirectQuery) {
        const query = new URLSearchParams(redirectQuery);

        const userName = query.get("userName");

        if (userName) {
          redirectUrl += `/${userName}`;
        } else {
          redirectUrl += `?${redirectQuery}`;
        }
      }

      const { emailVerified } = response.message;

      if (!emailVerified) {
        router.push(`/verify-email?redirectUrl=${encodeURIComponent(redirectUrl)}`);
        return;
      }

      router.push(redirectUrl);
    } else {
      const rejected = response.status === 401 || response.status === 403;
      if (rejected) {
        setStatus(AuthStateEnum.UNAUTHENTICATED);
      }
    }
  } catch (err) {}
};

export default authenticate;
