/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { userProps } from "./interface";

// Create a new context object
export const AuthContext = createContext({
  user: {
    accessToken: "",
    name: "",
    refreshToken: "",
    userType: "",
    isLogged: false,
  },
  setUser: (value: userProps) => {
    () => value;
  },
});

// Provider component to wrap your application
export const AuthProvider = ({ children }: any) => {
  const [cookies, setCookie] = useCookies(["awenix_profiler_admin"]);

  // Initialize context state from cookie or default value
  const initialContext = cookies.awenix_profiler_admin || {
    accessToken: "",
    name: "",
    refreshToken: "",
    userType: "",
    isLogged: false,
  };

  const [user, setUser] = useState(initialContext);

  // Update cookie whenever auth changes
  useEffect(() => {
    setCookie("awenix_profiler_admin", user, { path: "/" });
  }, [user, setCookie]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
