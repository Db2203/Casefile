"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CursorVariant = "default" | "link" | "case" | "hidden";

/**
 * Split contexts: zones only consume the STABLE actions (so hovering one card
 * never re-renders the other ~10 zones); only CustomCursor subscribes to the
 * changing variant state.
 */
interface CursorStateValue {
  variant: CursorVariant;
  label: string;
}
interface CursorActionsValue {
  set: (variant: CursorVariant, label?: string) => void;
  reset: () => void;
}

const CursorStateContext = createContext<CursorStateValue>({
  variant: "default",
  label: "",
});
const CursorActionsContext = createContext<CursorActionsValue>({
  set: () => {},
  reset: () => {},
});

export const useCursorState = () => useContext(CursorStateContext);
export const useCursorActions = () => useContext(CursorActionsContext);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorStateValue>({
    variant: "default",
    label: "",
  });

  const set = useCallback((variant: CursorVariant, label = "") => {
    setState({ variant, label });
  }, []);
  const reset = useCallback(() => {
    setState({ variant: "default", label: "" });
  }, []);

  const actions = useMemo(() => ({ set, reset }), [set, reset]);

  return (
    <CursorActionsContext.Provider value={actions}>
      <CursorStateContext.Provider value={state}>
        {children}
      </CursorStateContext.Provider>
    </CursorActionsContext.Provider>
  );
}
