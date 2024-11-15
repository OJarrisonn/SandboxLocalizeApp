import { Locator } from "@/lib/Locator";
import { createContext, useContext } from "react";

const locationContext = createContext(new Locator());

export const useLocation = () => useContext(locationContext);