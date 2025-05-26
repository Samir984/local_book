import { coreApiGetUser, coreApiLogoutUser, UserSchema } from "@/gen";
import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextProps {
  user: UserSchema | null;
  login: (user: UserSchema) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  isLoading: true,
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserSchema | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = function (user: UserSchema) {
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = async function () {
    setIsLoading(true);
    await coreApiLogoutUser();
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkAuth = async function () {
      try {
        const data = await coreApiGetUser();
   
        setUser(data);
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (err) {
        console.error(err)
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const contextValue = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };
