import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Advisor {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string | null;
  role_id: string | null;
  irdai_licence: string | null;
  specialization_id: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  advisor: Advisor | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAdvisor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  advisor: null,
  loading: true,
  signOut: async () => {},
  refreshAdvisor: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdvisor = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching advisor:', error);
        return;
      }
      setAdvisor(data);
    } catch (err) {
      console.error('Error fetching advisor:', err);
    }
  };

  const refreshAdvisor = async () => {
    if (user) {
      await fetchAdvisor(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchAdvisor(currentSession.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchAdvisor(newSession.user.id);
        } else {
          setAdvisor(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAdvisor(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, advisor, loading, signOut, refreshAdvisor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
