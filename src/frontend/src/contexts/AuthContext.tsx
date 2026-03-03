import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SubscriptionPlan } from "../backend.d";

// ── Simple hash function (SHA-256 via Web Crypto API) ──────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Auth Context ──────────────────────────────────────────
interface AuthContextType {
  email: string | null;
  isAuthenticated: boolean;
  plan: SubscriptionPlan;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    plan?: SubscriptionPlan,
  ) => Promise<void>;
  updatePlan: (plan: SubscriptionPlan) => void;
}

export const AuthContext = createContext<AuthContextType>({
  email: null,
  isAuthenticated: false,
  plan: SubscriptionPlan.free,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => {},
  updatePlan: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = "guardian_auth";

interface StoredAuth {
  email: string;
  passwordHash: string;
  plan: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>(SubscriptionPlan.free);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const auth: StoredAuth = JSON.parse(stored);
        if (auth.email) {
          setEmail(auth.email);
          setIsAuthenticated(true);
          setPlan((auth.plan as SubscriptionPlan) ?? SubscriptionPlan.free);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (emailInput: string, password: string): Promise<boolean> => {
      try {
        const passwordHash = await hashPassword(password);

        // Check localStorage for stored credentials (offline-capable login)
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const auth: StoredAuth = JSON.parse(stored);
          if (auth.email === emailInput && auth.passwordHash === passwordHash) {
            setEmail(emailInput);
            setIsAuthenticated(true);
            setPlan((auth.plan as SubscriptionPlan) ?? SubscriptionPlan.free);
            return true;
          }
        }

        // Try backend login (actor not available here, handled at page level)
        // Store email optimistically if it matches stored email
        const storedEmail = stored
          ? (JSON.parse(stored) as StoredAuth).email
          : null;
        if (storedEmail === emailInput) {
          setEmail(emailInput);
          setIsAuthenticated(true);
          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  const register = useCallback(
    async (
      emailInput: string,
      password: string,
      selectedPlan: SubscriptionPlan = SubscriptionPlan.free,
    ) => {
      const passwordHash = await hashPassword(password);
      setEmail(emailInput);
      setIsAuthenticated(true);
      setPlan(selectedPlan);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          email: emailInput,
          passwordHash,
          plan: selectedPlan,
        }),
      );
    },
    [],
  );

  const logout = useCallback(() => {
    setEmail(null);
    setIsAuthenticated(false);
    setPlan(SubscriptionPlan.free);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updatePlan = useCallback((newPlan: SubscriptionPlan) => {
    setPlan(newPlan);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const auth: StoredAuth = JSON.parse(stored);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...auth, plan: newPlan }),
      );
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        email,
        isAuthenticated,
        plan,
        isLoading,
        login,
        logout,
        register,
        updatePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { hashPassword };
