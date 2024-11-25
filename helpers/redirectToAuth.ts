export function redirectToAuth(status: number) {
  if (typeof window === "undefined") return;
  
  if (status === 401 || status === 403) {
    window.location.replace("/");
  }
}
