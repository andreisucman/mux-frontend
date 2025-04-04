import openErrorModal from "@/helpers/openErrorModal";

type Props<T> = {
  endpoint: string;
  method: "GET" | "POST";
  body?: T | FormData;
  server?: "api" | "chat" | "processing" | "admin";
};

const callTheServer = async <T>({ endpoint, method, body, server = "api" }: Props<T>) => {
  try {
    const isFormData = body instanceof FormData;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headers: HeadersInit = isFormData
      ? {}
      : { "Content-Type": "application/json", Timezone: timeZone };

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
          : server === "admin"
            ? process.env.NEXT_PUBLIC_ADMIN_SERVER_URL
            : process.env.NEXT_PUBLIC_PROCESSING_SERVER_URL;

    const response = await fetch(`${serverUrl}/${endpoint}`, fetchOptions);

    if (response.status === 429) {
      openErrorModal({ description: "You're browsing too fast. Slow down." });
      return { message: null, error: null };
    }

    if (response.status === 413) {
      openErrorModal({
        description: "The uploaded file is too large. Try decreasing the resolution or length.",
      });
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
