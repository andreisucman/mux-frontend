import { UserDataType } from "@/types/global";

export type UserContextType = {
  status: "loading" | "unauthenticated" | "authenticated" | "unknown";
  userDetails: Partial<UserDataType> | null;
  setStatus: (userDetails: "loading" | "unauthenticated" | "authenticated" | "unknown") => void;
  setUserDetails: (args: any) => void;
};

export type UserContextProviderProps = {
  children: React.ReactNode;
};
