import { useContext } from "react";
import { AuthContext } from "./authProvider";

// Custom hook to use the context
export const useAuthContext = () => useContext(AuthContext);
