
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { logLogout } from '../services/supabaseApi';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        // If there is no real Supabase session, purge any stale mock or legacy u-1 session
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId === 'u-1' || !storedUserId) {
          localStorage.removeItem('user_session');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_role');
        }
        setRole(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setRole((data?.role as UserRole) || UserRole.PERSONA);
    } catch (error) {
      console.warn('Could not fetch user role from database, falling back to persona:', error);
      setRole(UserRole.PERSONA);
    } finally {
      setLoading(false);
    }
  };

  const signOut = React.useCallback(async () => {
    try {
      if (supabase) {
        const currentUserId = user?.id;
        await supabase.auth.signOut();
        if (currentUserId) {
          logLogout(currentUserId).catch(console.error);
        }
      }
    } catch (error) {
      console.error('Error during signOut:', error);
    } finally {
      localStorage.removeItem('user_session');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      setUser(null);
      setSession(null);
      setRole(null);
    }
  }, [user]);

  const value = React.useMemo(() => ({ user, session, role, loading, signOut }), [user, session, role, loading, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
