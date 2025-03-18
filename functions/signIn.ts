import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import callTheServer from "./callTheServer";

export type SignInStateType = {
  redirectPath?: string;
  redirectQuery?: string;
  localUserId?: string | null;
  referrer: ReferrerEnum;
};

type Props = {
  stateObject?: SignInStateType;
};

export default async function signIn({ stateObject }: Props) {
  try {
    let url = "authorize";

    if (stateObject) {
      const encoded = encodeURIComponent(JSON.stringify(stateObject));
      url += `?state=${encoded}`;
    }

    const response = await callTheServer({
      endpoint: url,
      method: "GET",
    });

    if (response.status === 200) {
      window.location.href = response.message;
    }
  } catch (err) {}
}
