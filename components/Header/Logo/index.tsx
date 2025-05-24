import Image from "next/image";
import { useRouter } from "@/helpers/custom-router";
import classes from "./Logo.module.css";

export default function Logo(props: React.ComponentProps<"img">) {
  const router = useRouter();

  return (
    <picture onClick={() => router.push("/")} className={classes.picture}>
      <source srcSet="/logo-dark.svg" media="(prefers-color-scheme: dark)" />
      <Image
        src="/logo-light.svg"
        width={190 as any}
        height={32 as any}
        alt="Muxout logo"
        className={classes.logo}
        priority
        {...props}
      />
    </picture>
  );
}
