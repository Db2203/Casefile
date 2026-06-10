"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorVariant = "default" | "link" | "case" | "text" | "hidden";

interface CursorState {
  variant: CursorVariant;
  label: string;
  set: (variant: CursorVariant, label?: string) => void;
  reset: () => void;
}

const CursorContext = createContext<CursorState>({
  variant: "default",
  label: "",
  set: () => {},
  reset: () => {},
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");

  const set = useCallback((v: CursorVariant, l = "") => {
    setVariant(v);
    setLabel(l);
  }, []);
  const reset = useCallback(() => {
    setVariant("default");
    setLabel("");
  }, []);

  const value = useMemo(
    () => ({ variant, label, set, reset }),
    [variant, label, set, reset],
  );

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
}
