import callTheServer from "@/functions/callTheServer";

export async function clearCookies() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
  }

  await callTheServer({ endpoint: "signOut", method: "POST" });
}

export function getCookieValue(name: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = window.document.cookie;
  if (!cookies) return null;

  const cookieArray = cookies.split(";");

  for (const cookie of cookieArray) {
    const trimmedCookie = cookie.trim();

    if (trimmedCookie.startsWith(`${name}=`)) {
      return trimmedCookie.substring(name.length + 1) || null;
    }
  }

  return null;
}
