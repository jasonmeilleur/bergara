import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  authenticateUser,
  clearSession,
  getUserFromSession,
  registerUser,
  saveSessionEmail,
  type SignUpInput,
  type User,
} from "../lib/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => string | null;
  signUp: (input: SignUpInput) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUserFromSession());

  const login = useCallback((email: string, password: string) => {
    const authenticated = authenticateUser(email, password);
    if (!authenticated) {
      return "Email or password is incorrect.";
    }
    saveSessionEmail(authenticated.email);
    setUser(authenticated);
    return null;
  }, []);

  const signUp = useCallback((input: SignUpInput) => {
    try {
      const created = registerUser(input);
      saveSessionEmail(created.email);
      setUser(created);
      return null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Unable to create account.";
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      signUp,
      logout,
    }),
    [user, login, signUp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
