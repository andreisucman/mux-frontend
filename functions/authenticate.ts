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
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsLoading,
  setUserDetails,
}: AuthenticateProps) => {
  const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
  const { redirectPath, redirectQuery } = parsedState;

  const response = await callTheServer({
    endpoint: "authenticate",
    method: "POST",
    body: {
      state,
      code,
      email,
      password,
    },
  });

  if (response.status === 200) {
    if (response.error) {
      if (setIsLoading) setIsLoading(false);

      if (response.error === "blocked") {
        openErrorModal({
          title: `Account blocked`,
          description: `We have temporarily blocked your account while we investigate a potential violation of our Terms of Service. Check your email for more details.`,
        });
        setUserDetails(null);
        setStatus(AuthStateEnum.UNAUTHENTICATED);
        return;
      }

      if (response.error === "suspended") {
        openErrorModal({
          title: `Account suspended`,
          description: `This account is permanently suspended for violation of our Terms of Service.`,
        });
        setUserDetails(null);
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
      const searchParams = new URLSearchParams(redirectQuery);

      const userName = searchParams.get("userName");

      if (userName) {
        searchParams.delete("userName");
        const otherParams = searchParams.toString();
        redirectUrl += `/${userName}${otherParams ? "?" + otherParams : ""}`;
      } else {
        redirectUrl += `?${redirectQuery}`;
      }

      searchParams.delete("code");
    }

    const { emailVerified } = response.message;

    if (!emailVerified) {
      const url = `/verify-email?redirectUrl=${encodeURIComponent(redirectUrl)}`;
      router.push(url);
      return;
    }

    router.push(redirectUrl);
  } else {
    if (setIsLoading) setIsLoading(false);
    setStatus(AuthStateEnum.UNAUTHENTICATED);
  }
};

export default authenticate;
