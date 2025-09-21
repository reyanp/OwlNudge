import { createContext, useContext, useState, ReactNode } from "react";

export type UXFlags = {
  autoOpenDrawer: boolean;
  autoOpenChat: boolean;
  inlinePreview: boolean;
};

const defaultFlags: UXFlags = {
  autoOpenDrawer: false,
  autoOpenChat: false,
  inlinePreview: true,
};

const UXFlagsContext = createContext<{
  flags: UXFlags;
  setFlags: (u: Partial<UXFlags>) => void;
}>({
  flags: defaultFlags,
  setFlags: () => {},
});

export function UXFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlagsState] = useState<UXFlags>(defaultFlags);
  const setFlags = (u: Partial<UXFlags>) => setFlagsState((prev) => ({ ...prev, ...u }));
  return (
    <UXFlagsContext.Provider value={{ flags, setFlags }}>
      {children}
    </UXFlagsContext.Provider>
  );
}

export function useUXFlags() {
  return useContext(UXFlagsContext);
}
