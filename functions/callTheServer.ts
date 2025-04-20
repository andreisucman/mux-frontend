import openErrorModal from "@/helpers/openErrorModal";

type Props<T> = {
  endpoint: string;
  method: "GET" | "POST";
  body?: T | FormData;
};

const callTheServer = async <T>({ endpoint, method, body }: Props<T>) => {
  if (!document) return;

  try {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" };

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isDev = process.env.NEXT_PUBLIC_ENV === "dev";
    document.cookie = `MUX_timeZone=${encodeURIComponent(timeZone)}; path=/; ${isDev ? "" : "domain=muxout.com;"} SameSite=Lax`;

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body && method !== "GET") {
      fetchOptions.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/${endpoint}`,
      fetchOptions
    );

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
