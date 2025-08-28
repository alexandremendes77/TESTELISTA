import { createContext, useContext, useState, ReactNode } from "react";

export interface Reason {
  id: string;
  label: string;
  color: string; // hex
}

interface ReasonsState {
  attendance: Reason[];
  outstore: Reason[];
  offline: Reason[];
}

interface ReasonsContextProps {
  reasons: ReasonsState;
  setReasons: (update: ReasonsState) => void;
}

const defaultReasons: ReasonsState = {
  attendance: [
    { id: "converted", label: "Venda convertida", color: "#3b82f6" },
    { id: "lost", label: "Venda perdida", color: "#ef4444" },
  ],
  outstore: [{ id: "lunch", label: "Almoço", color: "#fbbf24" }],
  offline: [{ id: "end", label: "Fim de turno", color: "#6b7280" }],
};

const ReasonsContext = createContext<ReasonsContextProps | undefined>(undefined);

export const ReasonsProvider = ({ children }: { children: ReactNode }) => {
  const [reasons, setReasonsState] = useState<ReasonsState>(defaultReasons);

  const setReasons = (update: ReasonsState) => {
    setReasonsState(update);
  };

  return (
    <ReasonsContext.Provider value={{ reasons, setReasons }}>
      {children}
    </ReasonsContext.Provider>
  );
};

export const useReasons = () => {
  const ctx = useContext(ReasonsContext);
  if (!ctx) throw new Error("useReasons must be inside provider");
  return ctx;
};
