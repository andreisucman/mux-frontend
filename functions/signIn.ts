import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import callTheServer from "./callTheServer";

export type State = {
  redirectTo?: string;
  localUserId?: string;
  trackedUserId?: string;
};

type Props = {
  state?: State;
  router: AppRouterInstance;
};

export default async function signIn({ state, router }: Props) {
  try {
    let url = "authorize";

    if (state) {
      const encoded = encodeURIComponent(JSON.stringify(state));
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
