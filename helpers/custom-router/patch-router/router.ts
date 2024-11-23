import { useRouter as useRouterOriginal } from "next/navigation";
import { onStart } from "@/helpers/custom-router/events";
import { shouldTriggerStartEvent } from "@/helpers/custom-router/patch-router/should-trigger-start-event";

export function useRouter(): ReturnType<typeof useRouterOriginal> {
  const router = useRouterOriginal();
  return {
    ...router,
    push: (href, options) => {
      if (shouldTriggerStartEvent(href)) onStart();
      router.push(href, options);
    },
    replace: (href, options) => {
      if (shouldTriggerStartEvent(href)) onStart();
      router.replace(href, options);
    },
  };
}

