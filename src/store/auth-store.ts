
import { VerifySuccessResponse } from "@/@types/auth-types";
import { create } from "zustand";

type AuthState = {
  session: VerifySuccessResponse | null;
  isAuth: boolean;
  setIsAuth:  (isAuth: boolean) => void
  setSession: (session: VerifySuccessResponse | null) => void;
};

export const authStore = create<AuthState>((set) => ({
  session: null,
  isAuth: false,
  setSession: (session) => set({ session }),
  setIsAuth: (isAuth) => set({ isAuth }),
}));