export function clearCookies() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

export function getCookieValue(name: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = window.document.cookie;
  if (!cookies) return null;

  const parts = cookies.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}
