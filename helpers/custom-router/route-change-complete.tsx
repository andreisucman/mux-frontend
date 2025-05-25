import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { onComplete } from "./events";

function HandleOnCompleteChild() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    onComplete();
  }, [pathname, search]);

  return null;
}

export function HandleOnComplete() {
  return <HandleOnCompleteChild />;
}
