import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import callTheServer from "./callTheServer";

export type SignInStateType = {
  redirectPath?: string;
  redirectQuery?: string;
  localUserId?: string | null;
};

type Props = {
  stateObject?: SignInStateType;
  router: AppRouterInstance;
};

export default async function signIn({ stateObject, router }: Props) {
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
      router.push(response.message);
    }
  } catch (err) {
    console.log("Error in signIn: ", err);
  }
}
