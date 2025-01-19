"use client";

import { useEffect } from "react";
import NextError from "next/error";
import { usePathname, useSearchParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    callTheServer({
      server: "admin",
      method: "POST",
      endpoint: "addError",
      body: { error, pathname, searchParams },
    });
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
