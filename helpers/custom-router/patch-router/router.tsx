import { useRouter as useRouterOriginal } from "next/navigation";
import { onStart, onComplete } from "@/helpers/custom-router/events";
import { shouldTriggerStartEvent } from "./should-trigger-start-event";

/**
 * Drop-in replacement for `next/navigation`’s `useRouter`
 * that transparently starts / completes NProgress
 * and cleans up on navigation errors.
 */
export function useRouter(): ReturnType<typeof useRouterOriginal> {
  const router = useRouterOriginal();

  /** Internal helper to wrap `push` / `replace`. */
  const navigate = async (
    method: "push" | "replace",
    href: string,
    options?: Parameters<(typeof router)["push"]>[1]
  ) => {
    if (shouldTriggerStartEvent(href)) onStart();

    try {
      if (method === "push") {
        await router.push(href, options);
      } else {
        await router.replace(href, options);
      }
    } catch (error) {
      /* Make sure the bar isn’t left hanging on errors. */
      onComplete();
      throw error;
    }
  };

  return {
    ...router,
    push: (href: string, options?: Parameters<(typeof router)["push"]>[1]) =>
      navigate("push", href, options),
    replace: (
      href: string,
      options?: Parameters<(typeof router)["replace"]>[1]
    ) => navigate("replace", href, options),
  };
}
