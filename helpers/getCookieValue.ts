export default function getCookieValue(name: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = window.document.cookie;
  if (!cookies) return null;

  const parts = cookies.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}
