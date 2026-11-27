import { createContext, useContext } from "react";

export const SellContext = createContext<(conventionId: number) => void>(
  () => {},
);
export const useStartSelling = () => useContext(SellContext);
