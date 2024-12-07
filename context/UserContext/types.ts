import { UserDataType } from "@/types/global";

export type UserContextType = {
  status: AuthStateEnum;
  userDetails: Partial<UserDataType> | null;
  setStatus: (args: any) => void;
  setUserDetails: (args: any) => void;
};

export type UserContextProviderProps = {
  children: React.ReactNode;
};

export enum AuthStateEnum {
  UNAUTHENTICATED = "unauthenticated",
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNKNOWN = "unknown",
}
