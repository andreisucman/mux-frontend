/**
 * Decide whether a navigation should start NProgress.
 * – skips hash-only moves (`/page#A` → `/page#B`)
 * – skips true no-ops (`/page?x=1` → same path & query)
 * – respects modified-clicks (cmd/ctrl/shift/alt, middle-button)
 */
export function shouldTriggerStartEvent(
  href: string,
  event?: React.MouseEvent<HTMLElement>
): boolean {
  /* special-clicks open a new tab or are otherwise handled by the browser */
  if (
    event &&
    (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
  ) {
    return false;
  }

  /* During SSR we can’t inspect window.location */
  if (typeof window === "undefined") return true;

  try {
    const current = new URL(window.location.href);
    const target = new URL(href, window.location.origin);

    const samePath = current.pathname === target.pathname;
    const sameSearch = current.search === target.search;
    const sameHash = current.hash === target.hash;

    /* Hash-only or identical route ⇒ no progress bar. */
    return !(samePath && sameSearch); // start only if path or search changes
  } catch {
    /* Malformed `href` → play it safe and start the bar. */
    return true;
  }
}
