import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = {
  userId: string;
  orgId: string;
  projId: string;
};

type userContextType = {
  user: User | null;
  login: (userId: string, orgId: string, projId: string) => void;
  logout: () => void;
};

export const userContext = createContext<userContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userId: string, orgId: string, projId: string) => {
    const newUser = { userId, orgId, projId };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
}

export function useUser() {
  const context = useContext(userContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
