import { useEffect, useState } from "react";

export default function useShowSkeleton() {
  const [showSkeleton, setShowSkeleton] = useState(true);
  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return showSkeleton;
}
