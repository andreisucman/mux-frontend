import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import modifyQuery from "./modifyQuery";

export async function startNewChat(router: AppRouterInstance, value?: string) {
  const params = [];
  if (value) {
    params.push({ name: "query", value, action: "replace" });
  } else {
    params.push({ name: "conversationId", value: null, action: "delete" });
  }

  const query = modifyQuery({
    params,
  });
  
  router.push(`/advisor/chat?${query}`);
}
