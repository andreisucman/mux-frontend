import { getCookieValue } from "@/helpers/cookies";
import openErrorModal from "@/helpers/openErrorModal";

type Props<T> = {
  endpoint: string;
  method: "GET" | "POST";
  body?: T | FormData;
  accessToken?: string | null;
  server?: "api" | "chat" | "processing";
};

const callTheServer = async <T>({ endpoint, method, body, server = "api" }: Props<T>) => {
  try {
    const isFormData = body instanceof FormData;
    const headers: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" };

    const csrfToken = getCookieValue("MUX_csrfToken");

    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body && method !== "GET") {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
    }

    const serverUrl =
      server === "api"
        ? process.env.NEXT_PUBLIC_API_SERVER_URL
        : server === "chat"
          ? process.env.NEXT_PUBLIC_CHAT_SERVER_URL
          : process.env.NEXT_PUBLIC_PROCESSING_SERVER_URL;

    const response = await fetch(`${serverUrl}/${endpoint}`, fetchOptions);

    if (response.status === 429) {
      openErrorModal({ description: "You're browsing too fast. Slow down." });
      return { message: null, error: null };
    }

    const text = await response?.text();

    const data = text && text.length ? JSON.parse(text) : { message: null, error: null };

    return {
      status: response.status,
      ...data,
    };
  } catch (err: any) {
    console.log("Error in callTheServer: ", err);
    throw err;
  }
};

export default callTheServer;
